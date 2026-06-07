package pt.ipl.diariolx.domain.users

enum class UserRole {
    CONTRIBUTOR,
    EDITOR,
    ADMIN,
    ;

    fun features() =
        buildList {
            add("request-review")
            if (this@UserRole >= EDITOR) {
                addAll(listOf("review", "publish", "edit-published", "select-main-author"))
            }
            if (this@UserRole >= ADMIN) {
                addAll(listOf("manage-invites", "manage-users", "manage-categories", "manage-tags", "manage-content"))
            }
        }
}
