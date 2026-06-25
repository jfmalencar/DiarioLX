package pt.ipl.diariolx

import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.boot.test.web.server.LocalServerPort
import org.springframework.test.web.reactive.server.WebTestClient
import org.springframework.test.web.reactive.server.returnResult
import pt.ipl.diariolx.http.Uris
import pt.ipl.diariolx.http.dto.auth.LoginUserDTO
import pt.ipl.diariolx.http.dto.category.CreateUpdateCategoryRequestDTO

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class CategoryTests {
    private lateinit var client: WebTestClient

    @BeforeEach
    fun setup() {
        client = WebTestClient.bindToServer().baseUrl("http://localhost:$port").build()
    }

    // One of the very few places where we use property injection
    @LocalServerPort
    var port: Int = 0

    // Logs in as the seeded admin and returns the accessToken cookie value.
    private fun loginAsAdmin(): String =
        client
            .post()
            .uri(Uris.Auth.LOGIN)
            .bodyValue(LoginUserDTO(username = "admin", password = "Test_123"))
            .exchange()
            .expectStatus()
            .isNoContent
            .returnResult<Void>()
            .responseCookies
            .getFirst("accessToken")
            ?.value
            ?: throw IllegalStateException("Login did not return an accessToken cookie")

    @Test
    fun `can create and edit category`() {
        // given: an authenticated admin and a category payload
        val accessToken = loginAsAdmin()
        val category =
            CreateUpdateCategoryRequestDTO(name = "Test Category", description = "Test Description", slug = "test", color = "#ec6b43")

        // when: creating a category
        // then: the response is a 201
        val response =
            client
                .post()
                .uri(Uris.Categories.CREATE)
                .cookie("accessToken", accessToken)
                .bodyValue(category)
                .exchange()
                .expectStatus()
                .isCreated

        // get id from the location header
        val locationHeader = response.returnResult<Void>().responseHeaders.location
        val categoryId =
            locationHeader?.path?.substringAfterLast("/")
                ?: throw IllegalStateException("Location header is missing or invalid")

        // when: editing the category
        val request =
            CreateUpdateCategoryRequestDTO(
                name = "Updated Category",
                description = "Updated Description",
                slug = "updated",
                color = "#4287f5",
            )

        // then: the response for the edit is a 200
        client
            .put()
            .uri(Uris.Categories.byId(categoryId.toInt()).toString())
            .cookie("accessToken", accessToken)
            .bodyValue(request)
            .exchange()
            .expectStatus()
            .isNoContent
    }
}
