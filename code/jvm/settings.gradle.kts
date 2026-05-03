plugins {
    id("org.gradle.toolchains.foojay-resolver-convention") version "0.8.0"
    kotlin("jvm") version "2.2.0" apply false
    kotlin("plugin.spring") version "1.9.25" apply false
    id("org.springframework.boot") version "3.5.5" apply false
    id("io.spring.dependency-management") version "1.1.7" apply false
    id("org.jlleitschuh.gradle.ktlint") version "14.2.0" apply false
}

rootProject.name = "diariolx"

// The HOST module
include("host")
project(":host").projectDir = file("modules/host")

// The domain module
include("domain")
project(":domain").projectDir = file("modules/domain")

// The HTTP module, with the HTTP interface
include("http")
project(":http").projectDir = file("modules/http")

// The services module
include("services")
project(":services").projectDir = file("modules/services")

// The repository module, with the repository interfaces
include("repository")
project(":repository").projectDir = file("modules/repository")

// The repository-jdbi module, with the JDBC/JDBI based repository implementation
include("repository-jdbi")
project(":repository-jdbi").projectDir = file("modules/repository-jdbi")

// The storage module
include("storage")
project(":storage").projectDir = file("modules/storage")

// The storage-s3 module, with the S3 storage implementation
include("storage-s3")
project(":storage-s3").projectDir = file("modules/storage-s3")
