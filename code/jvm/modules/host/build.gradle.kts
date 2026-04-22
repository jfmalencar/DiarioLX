plugins {
    kotlin("jvm")
    kotlin("plugin.spring")
    id("org.springframework.boot")
    id("io.spring.dependency-management")
}

group = "pt.ipl.diariolx"
version = "1.0-SNAPSHOT"

dependencies {
    // Module dependencies
    implementation(project(":http"))
    implementation(project(":services"))
    implementation(project(":repository"))

    implementation("org.springframework.boot:spring-boot-starter-web")
    implementation("com.fasterxml.jackson.module:jackson-module-kotlin")
    implementation("org.jetbrains.kotlin:kotlin-reflect")
    implementation("org.springframework.boot:spring-boot-starter-validation")

    // for JDBI and Postgres
    implementation("org.jdbi:jdbi3-core:3.37.1")
    implementation("org.postgresql:postgresql:42.7.2")

    // To use Kotlin specific date and time functions
    implementation("org.jetbrains.kotlinx:kotlinx-datetime:0.4.1")

    // To get password encode
    implementation("org.springframework.security:spring-security-core:6.5.4")

    // To use WebTestClient on tests
    testImplementation("org.springframework.boot:spring-boot-starter-test")
    testImplementation("org.springframework.boot:spring-boot-starter-webflux")
    testImplementation(kotlin("test"))
}

tasks.test {
    useJUnitPlatform()
    if (System.getenv("DB_URL") == null) {
        environment("DB_URL", "jdbc:postgresql://localhost:5435/db?user=dbuser&password=changeit")
    }
    dependsOn(":repository-jdbi:dbTestsWait")
    finalizedBy(":repository-jdbi:dbTestsDown")
}

kotlin {
    jvmToolchain(21)
}

/**
 * Docker related tasks
 */
tasks.register<Copy>("extractUberJar") {
    dependsOn("assemble")
    // opens the JAR containing everything...
    from(
        zipTree(
            layout.buildDirectory
                .file("libs/host-$version.jar")
                .get()
                .toString(),
        ),
    )
    // ... into the 'build/dependency' folder
    into("build/dependency")
}

val dockerImageTagJvm = "diariolx-jvm"
val dockerImageTagNginx = "diariolx-nginx"
val dockerImageTagPostgresTest = "diariolx-postgres-test"
val dockerImageTagUbuntu = "diariolx-ubuntu"
// val dockerCmd = "docker"
val dockerCmd = "/usr/local/bin/docker"

tasks.register<Exec>("buildImageJvm") {
    dependsOn("extractUberJar")
    commandLine(dockerCmd, "build", "-t", dockerImageTagJvm, "-f", "tests/Dockerfile-jvm", ".")
}

tasks.register<Exec>("buildImageNginx") {
    commandLine(dockerCmd, "build", "-t", dockerImageTagNginx, "-f", "tests/Dockerfile-nginx", ".")
}

tasks.register<Exec>("buildImagePostgresTest") {
    commandLine(
        dockerCmd,
        "build",
        "-t",
        dockerImageTagPostgresTest,
        "-f",
        "tests/Dockerfile-postgres-test",
        "../repository-jdbi",
    )
}

tasks.register<Exec>("buildImageUbuntu") {
    commandLine(dockerCmd, "build", "-t", dockerImageTagUbuntu, "-f", "tests/Dockerfile-ubuntu", ".")
}

tasks.register("buildImageAll") {
    dependsOn("buildImageJvm")
    dependsOn("buildImageNginx")
    dependsOn("buildImagePostgresTest")
    dependsOn("buildImageUbuntu")
}

tasks.register<Exec>("allUp") {
    commandLine(dockerCmd, "compose", "up", "--force-recreate", "-d")
}

tasks.register<Exec>("allDown") {
    commandLine(dockerCmd, "compose", "down")
}
