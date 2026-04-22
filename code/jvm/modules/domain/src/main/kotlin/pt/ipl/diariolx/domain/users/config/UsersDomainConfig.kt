package pt.ipl.diariolx.domain.users.config

import kotlin.time.Duration


data class UsersDomainConfig(
    val tokenSizeInBytes: Int,
    val tokenExpirationTime: Duration,
    val sessionExpirationTime: Duration,
    val maxTokensPerUser: Int,
) {
    init {
        require(tokenSizeInBytes > 0)
        require(tokenExpirationTime.isPositive())
        require(sessionExpirationTime.isPositive())
        require(maxTokensPerUser > 0)
    }
}
