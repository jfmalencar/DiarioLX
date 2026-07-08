package pt.ipl.diariolx

import com.fasterxml.jackson.databind.ObjectMapper
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.boot.test.web.server.LocalServerPort
import org.springframework.test.web.reactive.server.WebTestClient
import org.springframework.test.web.reactive.server.returnResult
import pt.ipl.diariolx.domain.content.ContentState
import pt.ipl.diariolx.domain.content.value.ContentTag
import pt.ipl.diariolx.http.Uris
import pt.ipl.diariolx.http.dto.auth.LoginUserDTO
import pt.ipl.diariolx.http.dto.content.ContentResponseDTO
import pt.ipl.diariolx.http.dto.content.CreateContentDTO
import pt.ipl.diariolx.http.dto.content.CreateContentResponseDTO
import pt.ipl.diariolx.http.dto.content.PublishContentDTO
import pt.ipl.diariolx.http.dto.content.ReviewContentDTO
import pt.ipl.diariolx.http.dto.content.UpdateContentDTO
import kotlin.test.assertEquals
import kotlin.test.assertFalse
import kotlin.test.assertTrue

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class ContentTests {
    private lateinit var client: WebTestClient

    // One of the very few places where we use property injection
    @LocalServerPort
    var port: Int = 0

    @BeforeEach
    fun setup() {
        client = WebTestClient.bindToServer().baseUrl("http://localhost:$port").build()
    }

    private fun login(username: String): String =
        client
            .post()
            .uri(Uris.Auth.LOGIN)
            .bodyValue(LoginUserDTO(username = username, password = "Test_123"))
            .exchange()
            .expectStatus()
            .isNoContent
            .returnResult<Void>()
            .responseCookies
            .getFirst("accessToken")
            ?.value
            ?: throw IllegalStateException("Login for '$username' did not return an accessToken cookie")

    private fun byId(
        uri: String,
        id: Int,
    ) = uri.replace("{id}", id.toString())

    private fun stateOf(
        id: Int,
        cookie: String,
    ): ContentState =
        client
            .get()
            .uri(byId(Uris.Content.CONTENT_BY_ID, id))
            .cookie("accessToken", cookie)
            .exchange()
            .expectStatus()
            .isOk
            .expectBody(ContentResponseDTO::class.java)
            .returnResult()
            .responseBody!!
            .state

    private fun fullArticle(
        id: Int,
        title: String,
        categoryId: Int,
        mediaId: Int,
        tagId: Int,
        slug: String = "artigo-teste-fluxo-editorial",
    ) = UpdateContentDTO(
        id = id,
        title = title,
        headline = "Entrada de teste do fluxo editorial.",
        featuredMediaId = mediaId,
        slug = slug,
        categoryId = categoryId,
        parentId = null,
        embedUrl = null,
        authors = emptyList(),
        tags = listOf(ContentTag(tagId)),
        blocks = emptyList(),
    )

    private fun seedIds(admin: String): Triple<Int, Int, Int> {
        val seedList =
            client
                .get()
                .uri(Uris.Guest.LIST_CONTENT)
                .exchange()
                .expectStatus()
                .isOk
                .expectBody()
                .returnResult()
                .responseBody!!

        val seedContentId = ObjectMapper().readTree(seedList)["items"][0]["id"].asInt()
        val seed =
            client
                .get()
                .uri(byId(Uris.Content.CONTENT_BY_ID, seedContentId))
                .cookie("accessToken", admin)
                .exchange()
                .expectStatus()
                .isOk
                .expectBody(ContentResponseDTO::class.java)
                .returnResult()
                .responseBody!!

        return Triple(seed.category!!.id, seed.featuredImage!!.id, seed.tags.first().id)
    }

    private fun internalListIds(
        cookie: String,
        published: Boolean,
    ): List<Int> {
        val body =
            client
                .get()
                .uri { b ->
                    b
                        .path(Uris.Content.INTERNAL_GET_ALL)
                        .queryParam("state", "APPROVED")
                        .queryParam("published", published)
                        .queryParam("size", 100)
                        .build()
                }.cookie("accessToken", cookie)
                .exchange()
                .expectStatus()
                .isOk
                .expectBody()
                .returnResult()
                .responseBody!!

        return ObjectMapper().readTree(body)["items"].map { it["id"].asInt() }
    }

    @Test
    fun `public content list is available without authentication`() {
        // given: no credentials — the public content listing is a guest endpoint
        // when/then: it responds 200 OK
        client
            .get()
            .uri(Uris.Guest.LIST_CONTENT)
            .exchange()
            .expectStatus()
            .isOk
    }

    @Test
    fun `full editorial workflow - contributor drafts and submits, editor rejects, admin edits and publishes`() {
        val admin = login("admin")
        val editor = login("test.editor")
        val contributor = login("test.contributor")

        // Borrow valid category / featured-media / tag ids from an already-published seed article
        // (being published, it is guaranteed to carry all three).
        val seedList =
            client
                .get()
                .uri(Uris.Guest.LIST_CONTENT)
                .exchange()
                .expectStatus()
                .isOk
                .expectBody()
                .returnResult()
                .responseBody!!

        val seedId = ObjectMapper().readTree(seedList)["items"][0]["id"].asInt()
        val seed =
            client
                .get()
                .uri(byId(Uris.Content.CONTENT_BY_ID, seedId))
                .cookie("accessToken", admin)
                .exchange()
                .expectStatus()
                .isOk
                .expectBody(ContentResponseDTO::class.java)
                .returnResult()
                .responseBody!!

        val categoryId = seed.category!!.id
        val mediaId = seed.featuredImage!!.id
        val tagId = seed.tags.first().id

        // 1. Contributor creates a draft article.
        val id =
            client
                .post()
                .uri(Uris.Content.MAIN)
                .cookie("accessToken", contributor)
                .bodyValue(CreateContentDTO(type = "ARTICLE"))
                .exchange()
                .expectStatus()
                .isCreated
                .expectBody(CreateContentResponseDTO::class.java)
                .returnResult()
                .responseBody!!
                .id
        assertEquals(ContentState.DRAFT, stateOf(id, contributor))

        // 2. Contributor fills in every required field.
        client
            .put()
            .uri(Uris.Content.MAIN)
            .cookie("accessToken", contributor)
            .bodyValue(fullArticle(id, "Reportagem sobre a cidade", categoryId, mediaId, tagId))
            .exchange()
            .expectStatus()
            .isNoContent

        // 3. Contributor cannot review their own content: publishing and rejecting are EDITOR+.
        client
            .post()
            .uri(byId(Uris.Content.PUBLISH, id))
            .cookie("accessToken", contributor)
            .exchange()
            .expectStatus()
            .isForbidden

        client
            .post()
            .uri(byId(Uris.Content.REJECT, id))
            .cookie("accessToken", contributor)
            .bodyValue(ReviewContentDTO(comment = "nope"))
            .exchange()
            .expectStatus()
            .isForbidden

        // 4. Contributor submits for review → PENDING_REVIEW.
        client
            .post()
            .uri(byId(Uris.Content.SUBMIT, id))
            .cookie("accessToken", contributor)
            .exchange()
            .expectStatus()
            .isNoContent

        assertEquals(ContentState.PENDING_REVIEW, stateOf(id, contributor))

        // 5. Editor rejects it with a mandatory comment → REJECTED.
        client
            .post()
            .uri(byId(Uris.Content.REJECT, id))
            .cookie("accessToken", editor)
            .bodyValue(ReviewContentDTO(comment = "Faltam fontes e contexto."))
            .exchange()
            .expectStatus()
            .isNoContent
        assertEquals(ContentState.REJECTED, stateOf(id, admin))

        // 6. Admin edits the rejected article (an edit resets it to draft) ...
        client
            .put()
            .uri(Uris.Content.MAIN)
            .cookie("accessToken", admin)
            .bodyValue(fullArticle(id, "Reportagem sobre a cidade (revista)", categoryId, mediaId, tagId))
            .exchange()
            .expectStatus()
            .isNoContent

        // ... and publishes directly, without a second review → APPROVED.
        client
            .post()
            .uri(byId(Uris.Content.PUBLISH, id))
            .cookie("accessToken", admin)
            .exchange()
            .expectStatus()
            .isNoContent

        assertEquals(ContentState.APPROVED, stateOf(id, admin))

        // 7. Clean up - remove it
        client
            .delete()
            .uri(byId(Uris.Content.CONTENT_BY_ID, id))
            .cookie("accessToken", admin)
            .exchange()
            .expectStatus()
            .isNoContent

        // ... and content isn't found anymore
        client
            .get()
            .uri(byId(Uris.Content.CONTENT_BY_ID, id))
            .cookie("accessToken", admin)
            .exchange()
            .expectStatus()
            .isNotFound
    }

    @Test
    fun `scheduled content stays hidden until its moment, backdated content is visible`() {
        val admin = login("admin")
        val contributor = login("test.contributor")
        val (categoryId, mediaId, tagId) = seedIds(admin)
        val slug = "artigo-agendamento-teste"

        // A contributor drafts a fully populated article.
        val id =
            client
                .post()
                .uri(Uris.Content.MAIN)
                .cookie("accessToken", contributor)
                .bodyValue(CreateContentDTO(type = "ARTICLE"))
                .exchange()
                .expectStatus()
                .isCreated
                .expectBody(CreateContentResponseDTO::class.java)
                .returnResult()
                .responseBody!!
                .id

        client
            .put()
            .uri(Uris.Content.MAIN)
            .cookie("accessToken", contributor)
            .bodyValue(fullArticle(id, "Reportagem agendada", categoryId, mediaId, tagId, slug = slug))
            .exchange()
            .expectStatus()
            .isNoContent

        val nowSeconds = System.currentTimeMillis() / 1000

        // Admin schedules it for the future.
        client
            .post()
            .uri(byId(Uris.Content.PUBLISH, id))
            .cookie("accessToken", admin)
            .bodyValue(PublishContentDTO(publishedAt = nowSeconds + 100_000))
            .exchange()
            .expectStatus()
            .isNoContent

        // It is approved but hidden from the public site and listed under "scheduled", not "published".
        client
            .get()
            .uri(Uris.Guest.GET_CONTENT.replace("{slug}", slug))
            .exchange()
            .expectStatus()
            .isNotFound

        assertTrue(id in internalListIds(admin, published = false), "scheduled tab should list it")
        assertFalse(id in internalListIds(admin, published = true), "published tab should not yet")

        // Admin re-publishes with a date in the past (backdating).
        client
            .post()
            .uri(byId(Uris.Content.PUBLISH, id))
            .cookie("accessToken", admin)
            .bodyValue(PublishContentDTO(publishedAt = nowSeconds - 100_000))
            .exchange()
            .expectStatus()
            .isNoContent

        // Now it is publicly visible and has moved to the "published" tab.
        client
            .get()
            .uri(Uris.Guest.GET_CONTENT.replace("{slug}", slug))
            .exchange()
            .expectStatus()
            .isOk

        assertTrue(id in internalListIds(admin, published = true), "published tab should list it")
        assertFalse(id in internalListIds(admin, published = false), "scheduled tab should no longer")
    }
}
