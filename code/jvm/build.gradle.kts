subprojects {
    apply(plugin = "org.jlleitschuh.gradle.ktlint")
    repositories {
        mavenCentral()
    }

    tasks.withType<Test>().configureEach {
        val envFile = rootProject.file(".env")
        envFile
            .readLines()
            .filter { it.isNotBlank() && !it.trim().startsWith("#") }
            .forEach {
                val (key, value) = it.split("=", limit = 2)
                environment(key.trim(), value.trim())
            }
    }
}

tasks.register<Exec>("composeDown") {
    commandLine("docker", "compose", "down")
}

extra["composeFileDir"] = layout.projectDirectory
println("composeFileDir - ${layout.projectDirectory}")
