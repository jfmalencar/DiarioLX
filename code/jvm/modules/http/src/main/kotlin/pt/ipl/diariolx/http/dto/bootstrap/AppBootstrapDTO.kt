package pt.ipl.diariolx.http.dto.bootstrap

data class AppBootstrapDTO(
    val version: String,
    val api: ApiEndpointsDTO,
    val assets: AssetsDTO,
    val creditRoles: List<CreditRolesDTO>,
    val sections: List<SectionTypeConfigDTO>,
    val settings: SettingsBootstrapDTO,
)
