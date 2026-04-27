plugins {
    kotlin("jvm")
}

group = "pt.ipl.diariolx"
version = "1.0-SNAPSHOT"

dependencies {
    // Module dependencies
    api(project(":domain"))

    // To use Kotlin specific date and time functions
    implementation("org.jetbrains.kotlinx:kotlinx-datetime:0.4.1")

    // AWS SDK
    implementation("software.amazon.awssdk:s3:2.42.35")

    testImplementation(kotlin("test"))
}

tasks.test {
    useJUnitPlatform()
}

kotlin {
    jvmToolchain(21)
}
