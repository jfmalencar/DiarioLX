package pt.ipl.diariolx.domain.invites.config

import kotlin.time.Duration


data class InviteDomainConfig(
    val inviteExpirationTime: Duration,
) {
    init {
        require(inviteExpirationTime.isPositive()) {}
    }
}
