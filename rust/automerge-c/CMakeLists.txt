cmake_minimum_required(VERSION 3.23 FATAL_ERROR)

project(automerge-c VERSION 0.2.2
                    LANGUAGES C
                    DESCRIPTION "C bindings for the Automerge Rust library.")

include(CTest)

include(CMakePackageConfigHelpers)

include(GNUInstallDirs)

list(APPEND CMAKE_MODULE_PATH "${PROJECT_SOURCE_DIR}/cmake")

set(CMAKE_WINDOWS_EXPORT_ALL_SYMBOLS ON)

set(${PROJECT_NAME}-DEFAULT_LIBRARY_NAME "automerge")

set(${PROJECT_NAME}-LIBRARY_NAME "${${PROJECT_NAME}-DEFAULT_LIBRARY_NAME}" CACHE STRING "The library's name.")

set(DEFAULT_BINDINGS_NAME "${${PROJECT_NAME}-DEFAULT_LIBRARY_NAME}_core")

set(BINDINGS_NAME "${DEFAULT_BINDINGS_NAME}" CACHE STRING "The bindings' name.")

set(${PROJECT_NAME}-LIBRARY_PREFIX "${CMAKE_STATIC_LIBRARY_PREFIX}" CACHE STRING "An output library's prefix.")

set(${PROJECT_NAME}-LIBRARY_SUFFIX "${CMAKE_STATIC_LIBRARY_SUFFIX}" CACHE STRING "An output library's suffix.")

option(BUILD_SHARED_LIBS "Enable the choice of a shared or static library.")

option(UTF32_INDEXING "Enable UTF-32 indexing.")

string(MAKE_C_IDENTIFIER ${PROJECT_NAME} SYMBOL_PREFIX)

string(TOUPPER ${SYMBOL_PREFIX} SYMBOL_PREFIX)

set(CARGO_TARGET_DIR "${PROJECT_BINARY_DIR}/Cargo/target")

set(CBINDGEN_INCLUDEDIR "${PROJECT_BINARY_DIR}/${CMAKE_INSTALL_INCLUDEDIR}")

set(CBINDGEN_TARGET_DIR "${CBINDGEN_INCLUDEDIR}/${PROJECT_NAME}")

find_program (CARGO_CMD
              "cargo"
              PATHS "$ENV{CARGO_HOME}/bin"
              DOC "The Rust package manager"
)

if(NOT CARGO_CMD)
    message(FATAL_ERROR "Cargo (Rust package manager) not found! "
                        "Please install it and/or set the CARGO_HOME "
                        "environment variable to its path.")
endif()

find_program(RUSTC_CMD
             "rustc"
             PATHS "$ENV{CARGO_HOME}/bin"
             DOC "The Rust compiler"
)

if(NOT RUSTC_CMD)
    message(FATAL_ERROR "Rustc (Rust compiler) not found! "
                        "Please install it and/or set the CARGO_HOME "
                        "environment variable to its path.")
endif()

# In order to build with -Z build-std, we need to pass target explicitly.
# https://doc.rust-lang.org/cargo/reference/unstable.html#build-std
execute_process (
    COMMAND ${RUSTC_CMD} -vV
    OUTPUT_VARIABLE RUSTC_VERSION
    OUTPUT_STRIP_TRAILING_WHITESPACE
)
string(REGEX REPLACE ".*host: ([^ \n]*).*" "\\1"
    CARGO_TARGET
    ${RUSTC_VERSION}
)

set(CARGO_FLAGS --target=${CARGO_TARGET})

set(RUSTFLAGS "")

if(CMAKE_BUILD_TYPE MATCHES Debug)
    set(CARGO_BUILD_TYPE "debug")
else()
    set(CARGO_BUILD_TYPE "release")

    if (NOT RUSTC_VERSION MATCHES "nightly")
        set(RUSTUP_TOOLCHAIN nightly)
    endif()

    set(RUSTFLAGS "${RUSTFLAGS} -C panic=abort")

    set(CARGO_FLAGS -Z build-std=std,panic_abort --release ${CARGO_FLAGS})
endif()

if(UTF32_INDEXING)
    set(CARGO_FEATURES "")
    set(TEXT_INDEXING_ENCODING "UTF32")
else()
    set(CARGO_FEATURES "-F automerge/utf8-indexing")
    set(TEXT_INDEXING_ENCODING "UTF8")
endif()

set(CARGO_BINARY_DIR "${CARGO_TARGET_DIR}/${CARGO_TARGET}/${CARGO_BUILD_TYPE}")

configure_file(
    ${PROJECT_SOURCE_DIR}/cmake/Cargo.toml.in
    ${PROJECT_SOURCE_DIR}/Cargo.toml
    NEWLINE_STYLE LF
)

set(INCLUDE_GUARD_PREFIX "${SYMBOL_PREFIX}")

configure_file(
    ${PROJECT_SOURCE_DIR}/cmake/cbindgen.toml.in
    ${PROJECT_SOURCE_DIR}/cbindgen.toml
    @ONLY
    NEWLINE_STYLE LF
)

set(CARGO_OUTPUT
    ${CBINDGEN_TARGET_DIR}/${${PROJECT_NAME}-LIBRARY_NAME}.h
    ${CARGO_BINARY_DIR}/${CMAKE_STATIC_LIBRARY_PREFIX}${BINDINGS_NAME}${CMAKE_STATIC_LIBRARY_SUFFIX}
)

# \note cbindgen's naming behavior isn't fully configurable and it ignores
#       `const fn` calls (https://github.com/eqrion/cbindgen/issues/252).
add_custom_command(
    OUTPUT
        ${CARGO_OUTPUT}
    COMMAND
        # Force cbindgen to regenerate the header file by updating its configuration file; removing the header won't.
        ${CMAKE_COMMAND} -DCONDITION=NOT_EXISTS -P ${PROJECT_SOURCE_DIR}/cmake/file-touch.cmake -- ${CBINDGEN_TARGET_DIR}/${${PROJECT_NAME}-LIBRARY_NAME}.h ${PROJECT_SOURCE_DIR}/cbindgen.toml
    COMMAND
        ${CMAKE_COMMAND} -E env CARGO_TARGET_DIR=${CARGO_TARGET_DIR} CBINDGEN_TARGET_DIR=${CBINDGEN_TARGET_DIR} RUSTUP_TOOLCHAIN=${RUSTUP_TOOLCHAIN} RUSTFLAGS=${RUSTFLAGS} ${CARGO_CMD} build ${CARGO_FLAGS} ${CARGO_FEATURES}
    COMMAND
        # Compensate for cbindgen's translation of consecutive uppercase letters to "ScreamingSnakeCase".
        ${CMAKE_COMMAND} -DMATCH_REGEX=A_M\([^_]+\)_ -DREPLACE_EXPR=AM_\\1_ -P ${PROJECT_SOURCE_DIR}/cmake/file-regex-replace.cmake -- ${CBINDGEN_TARGET_DIR}/${${PROJECT_NAME}-LIBRARY_NAME}.h
    COMMAND
        # Compensate for cbindgen ignoring `std::mem::size_of<usize>()` calls.
        ${CMAKE_COMMAND} -DMATCH_REGEX=USIZE_ -DREPLACE_EXPR=\+${CMAKE_SIZEOF_VOID_P} -P ${PROJECT_SOURCE_DIR}/cmake/file-regex-replace.cmake -- ${CBINDGEN_TARGET_DIR}/${${PROJECT_NAME}-LIBRARY_NAME}.h
    MAIN_DEPENDENCY
        src/lib.rs
    DEPENDS
        src/actor_id.rs
        src/byte_span.rs
        src/change.rs
        src/doc.rs
        src/doc/list.rs
        src/doc/map.rs
        src/doc/mark.rs
        src/doc/utils.rs
        src/index.rs
        src/item.rs
        src/items.rs
        src/obj.rs
        src/result.rs
        src/sync.rs
        src/sync/have.rs
        src/sync/message.rs
        src/sync/state.rs
        ${PROJECT_SOURCE_DIR}/build.rs
        ${PROJECT_SOURCE_DIR}/cmake/Cargo.toml.in
        ${PROJECT_SOURCE_DIR}/cmake/cbindgen.toml.in
    WORKING_DIRECTORY
        ${PROJECT_SOURCE_DIR}
    COMMENT
        "Producing the bindings' artifacts with Cargo..."
    VERBATIM
)

add_custom_target(${BINDINGS_NAME}_artifacts ALL
    DEPENDS ${CARGO_OUTPUT}
)

# Enable an external build tool to find the bindings in the root of the
# out-of-source build directory when it has overridden an aspect of its name.
if(NOT (("${${PROJECT_NAME}-LIBRARY_PREFIX}" STREQUAL "${CMAKE_STATIC_LIBRARY_PREFIX}") AND
        ("${BINDINGS_NAME}" STREQUAL "${DEFAULT_BINDINGS_NAME}") AND
        ("${${PROJECT_NAME}-LIBRARY_SUFFIX}" STREQUAL "${CMAKE_STATIC_LIBRARY_SUFFIX}")))
    add_custom_command(
        TARGET ${BINDINGS_NAME}_artifacts
        POST_BUILD
        COMMAND
            ${CMAKE_COMMAND} -E echo "Copying \"${CARGO_BINARY_DIR}/${CMAKE_STATIC_LIBRARY_PREFIX}${BINDINGS_NAME}${CMAKE_STATIC_LIBRARY_SUFFIX}\" to \"${PROJECT_BINARY_DIR}/${${PROJECT_NAME}-LIBRARY_PREFIX}${BINDINGS_NAME}${${PROJECT_NAME}-LIBRARY_SUFFIX}\"..."
        COMMAND
            ${CMAKE_COMMAND} -E copy ${CARGO_BINARY_DIR}/${CMAKE_STATIC_LIBRARY_PREFIX}${BINDINGS_NAME}${CMAKE_STATIC_LIBRARY_SUFFIX} ${PROJECT_BINARY_DIR}/${${PROJECT_NAME}-LIBRARY_PREFIX}${BINDINGS_NAME}${${PROJECT_NAME}-LIBRARY_SUFFIX}
        WORKING_DIRECTORY
            ${PROJECT_SOURCE_DIR}
        COMMENT
            "Aliasing the bindings for the external build tool..."
        VERBATIM
    )
endif()

add_library(${BINDINGS_NAME} STATIC IMPORTED GLOBAL)

target_include_directories(${BINDINGS_NAME} INTERFACE "${CBINDGEN_INCLUDEDIR}")

set_target_properties(
    ${BINDINGS_NAME}
    PROPERTIES
        # \note Cargo writes a debug build into a nested directory instead of
        #       decorating its name.
        DEBUG_POSTFIX ""
        DEFINE_SYMBOL ""
        IMPORTED_IMPLIB ""
        IMPORTED_LOCATION "${CARGO_BINARY_DIR}/${CMAKE_STATIC_LIBRARY_PREFIX}${BINDINGS_NAME}${CMAKE_STATIC_LIBRARY_SUFFIX}"
        IMPORTED_NO_SONAME "TRUE"
        IMPORTED_SONAME ""
        LINKER_LANGUAGE C
        PUBLIC_HEADER "${CBINDGEN_TARGET_DIR}/${${PROJECT_NAME}-LIBRARY_NAME}.h"
        SOVERSION "${PROJECT_VERSION_MAJOR}"
        VERSION "${PROJECT_VERSION}"
        # \note Cargo exports all of the symbols automatically.
        WINDOWS_EXPORT_ALL_SYMBOLS "TRUE"
)

target_compile_definitions(${BINDINGS_NAME} INTERFACE $<TARGET_PROPERTY:${BINDINGS_NAME},DEFINE_SYMBOL>)

set(UTILS_SUBDIR "utils")

add_custom_command(
    OUTPUT
        ${CBINDGEN_TARGET_DIR}/${UTILS_SUBDIR}/enum_string.h
        ${PROJECT_BINARY_DIR}/src/${UTILS_SUBDIR}/enum_string.c
    COMMAND
        ${CMAKE_COMMAND} -DPROJECT_NAME=${PROJECT_NAME} -DLIBRARY_NAME=${${PROJECT_NAME}-LIBRARY_NAME} -DSUBDIR=${UTILS_SUBDIR} -P ${PROJECT_SOURCE_DIR}/cmake/enum-string-functions-gen.cmake -- ${CBINDGEN_TARGET_DIR}/${${PROJECT_NAME}-LIBRARY_NAME}.h ${CBINDGEN_TARGET_DIR}/${UTILS_SUBDIR}/enum_string.h ${PROJECT_BINARY_DIR}/src/${UTILS_SUBDIR}/enum_string.c
    MAIN_DEPENDENCY
        ${CBINDGEN_TARGET_DIR}/${${PROJECT_NAME}-LIBRARY_NAME}.h
    DEPENDS
        ${PROJECT_SOURCE_DIR}/cmake/enum-string-functions-gen.cmake
    WORKING_DIRECTORY
        ${PROJECT_SOURCE_DIR}
    COMMENT
        "Generating the enum string functions with CMake..."
    VERBATIM
)

add_custom_target(${${PROJECT_NAME}-LIBRARY_NAME}_utilities
    DEPENDS ${CBINDGEN_TARGET_DIR}/${UTILS_SUBDIR}/enum_string.h
            ${PROJECT_BINARY_DIR}/src/${UTILS_SUBDIR}/enum_string.c
)

add_library(${${PROJECT_NAME}-LIBRARY_NAME})

target_compile_features(${${PROJECT_NAME}-LIBRARY_NAME} PRIVATE c_std_99)

set(CMAKE_THREAD_PREFER_PTHREAD TRUE)

set(THREADS_PREFER_PTHREAD_FLAG TRUE)

find_package(Threads REQUIRED)

set(LIBRARY_DEPENDENCIES Threads::Threads ${CMAKE_DL_LIBS})

if(WIN32)
    list(APPEND LIBRARY_DEPENDENCIES Bcrypt ntdll userenv ws2_32)
else()
    list(APPEND LIBRARY_DEPENDENCIES m)
endif()

target_link_libraries(${${PROJECT_NAME}-LIBRARY_NAME} PUBLIC ${LIBRARY_DEPENDENCIES})

# \note An imported library's INTERFACE_INCLUDE_DIRECTORIES property can't
#       contain a non-existent path so its build-time include directory
#       must be specified for all of its dependent targets instead.
target_include_directories(${${PROJECT_NAME}-LIBRARY_NAME}
    PUBLIC "$<BUILD_INTERFACE:${CBINDGEN_INCLUDEDIR};${PROJECT_SOURCE_DIR}/${CMAKE_INSTALL_INCLUDEDIR}>"
           "$<INSTALL_INTERFACE:${CMAKE_INSTALL_INCLUDEDIR}>"
)

add_dependencies(${${PROJECT_NAME}-LIBRARY_NAME} ${BINDINGS_NAME}_artifacts)

if(WIN32)
    find_program(LIB_TOOL "lib" REQUIRED)

    add_custom_command(
        TARGET ${${PROJECT_NAME}-LIBRARY_NAME}
        POST_BUILD
        COMMAND
            ${CMAKE_COMMAND} -E echo "Merging its dependent libraries into \"$<TARGET_FILE:${${PROJECT_NAME}-LIBRARY_NAME}>\"..."
        COMMAND
            ${LIB_TOOL} /OUT:$<TARGET_FILE_NAME:${${PROJECT_NAME}-LIBRARY_NAME}> $<TARGET_FILE_NAME:${${PROJECT_NAME}-LIBRARY_NAME}> $<TARGET_FILE:${BINDINGS_NAME}> ntdll.lib
        WORKING_DIRECTORY
            ${PROJECT_BINARY_DIR}
        COMMENT
            "Merging the libraries..."
        VERBATIM
    )
else()
    set(OBJECTS_DIR objects)

    set(BINDINGS_OBJECTS_DIR ${OBJECTS_DIR}/$<TARGET_NAME:${BINDINGS_NAME}>)

    add_custom_command(
        TARGET "${${PROJECT_NAME}-LIBRARY_NAME}"
        POST_BUILD
        COMMAND
            ${CMAKE_COMMAND} -E echo "Merging its dependent libraries into \"$<TARGET_FILE:${${PROJECT_NAME}-LIBRARY_NAME}>\"..."
        COMMAND
            ${CMAKE_COMMAND} -E rm -rf ${OBJECTS_DIR}
        COMMAND
            ${CMAKE_COMMAND} -E make_directory ${BINDINGS_OBJECTS_DIR}
        COMMAND
            ${CMAKE_COMMAND} -E echo "${CMAKE_AR} -x  --plugin /usr/lib/bfd-plugins/liblto_plugin.so $<TARGET_FILE:${BINDINGS_NAME}>"
        COMMAND
            ${CMAKE_COMMAND} -E chdir ${BINDINGS_OBJECTS_DIR} ${CMAKE_AR} -x --plugin /usr/lib/bfd-plugins/liblto_plugin.so $<TARGET_FILE:${BINDINGS_NAME}>
        COMMAND
            ${CMAKE_COMMAND} -E echo "${CMAKE_AR} -rs --plugin /usr/lib/bfd-plugins/liblto_plugin.so $<TARGET_FILE_NAME:${${PROJECT_NAME}-LIBRARY_NAME}> ${BINDINGS_OBJECTS_DIR}/*.o"
        COMMAND
            ${CMAKE_AR} -rs --plugin /usr/lib/bfd-plugins/liblto_plugin.so $<TARGET_FILE_NAME:${${PROJECT_NAME}-LIBRARY_NAME}> ${BINDINGS_OBJECTS_DIR}/*.o
        WORKING_DIRECTORY
            ${PROJECT_BINARY_DIR}
        COMMENT
            "Merging the libraries' constituent object files..."
    )
endif()

# Enable an external build tool to find the library in the root of the
# out-of-source build directory when it has overridden an aspect of its name.
if(NOT (("${${PROJECT_NAME}-LIBRARY_PREFIX}" STREQUAL "${CMAKE_STATIC_LIBRARY_PREFIX}") AND
        ("${${PROJECT_NAME}-LIBRARY_NAME}" STREQUAL "${${PROJECT_NAME}-DEFAULT_LIBRARY_NAME}") AND
        ("${${PROJECT_NAME}-LIBRARY_SUFFIX}" STREQUAL "${CMAKE_STATIC_LIBRARY_SUFFIX}")))
    add_custom_command(
        TARGET ${${PROJECT_NAME}-LIBRARY_NAME}
        POST_BUILD
        COMMAND
            ${CMAKE_COMMAND} -E echo "Copying \"${CMAKE_STATIC_LIBRARY_PREFIX}${${PROJECT_NAME}-LIBRARY_NAME}${CMAKE_STATIC_LIBRARY_SUFFIX}\" to \"${PROJECT_BINARY_DIR}/${${PROJECT_NAME}-LIBRARY_PREFIX}${${PROJECT_NAME}-LIBRARY_NAME}${${PROJECT_NAME}-LIBRARY_SUFFIX}\"..."
        COMMAND
            ${CMAKE_COMMAND} -E copy ${PROJECT_BINARY_DIR}/${CMAKE_STATIC_LIBRARY_PREFIX}${${PROJECT_NAME}-LIBRARY_NAME}${CMAKE_STATIC_LIBRARY_SUFFIX} ${PROJECT_BINARY_DIR}/${${PROJECT_NAME}-LIBRARY_PREFIX}${${PROJECT_NAME}-LIBRARY_NAME}${${PROJECT_NAME}-LIBRARY_SUFFIX}
        WORKING_DIRECTORY
            ${PROJECT_SOURCE_DIR}
        COMMENT
            "Aliasing the library for the external build tool..."
        VERBATIM
    )
endif()

# Generate the configuration header.
math(EXPR INTEGER_PROJECT_VERSION_MAJOR "${PROJECT_VERSION_MAJOR} * 100000")

math(EXPR INTEGER_PROJECT_VERSION_MINOR "${PROJECT_VERSION_MINOR} * 100")

math(EXPR INTEGER_PROJECT_VERSION_PATCH "${PROJECT_VERSION_PATCH}")

math(EXPR INTEGER_PROJECT_VERSION "${INTEGER_PROJECT_VERSION_MAJOR} + \
                                   ${INTEGER_PROJECT_VERSION_MINOR} + \
                                   ${INTEGER_PROJECT_VERSION_PATCH}")

configure_file(
    ${PROJECT_SOURCE_DIR}/cmake/config.h.in
    ${CBINDGEN_TARGET_DIR}/config.h
    @ONLY
    NEWLINE_STYLE LF
)

target_sources(${${PROJECT_NAME}-LIBRARY_NAME}
    PRIVATE
        src/${UTILS_SUBDIR}/result.c
        src/${UTILS_SUBDIR}/stack_callback_data.c
        src/${UTILS_SUBDIR}/stack.c
        src/${UTILS_SUBDIR}/string.c
        ${PROJECT_BINARY_DIR}/src/${UTILS_SUBDIR}/enum_string.c
    PUBLIC
        FILE_SET api TYPE HEADERS
            BASE_DIRS
                ${CBINDGEN_INCLUDEDIR}
                ${CMAKE_INSTALL_INCLUDEDIR}
            FILES
                ${CBINDGEN_TARGET_DIR}/${${PROJECT_NAME}-LIBRARY_NAME}.h
                ${CBINDGEN_TARGET_DIR}/${UTILS_SUBDIR}/enum_string.h
                ${CMAKE_INSTALL_INCLUDEDIR}/${PROJECT_NAME}/${UTILS_SUBDIR}/result.h
                ${CMAKE_INSTALL_INCLUDEDIR}/${PROJECT_NAME}/${UTILS_SUBDIR}/stack_callback_data.h
                ${CMAKE_INSTALL_INCLUDEDIR}/${PROJECT_NAME}/${UTILS_SUBDIR}/stack.h
                ${CMAKE_INSTALL_INCLUDEDIR}/${PROJECT_NAME}/${UTILS_SUBDIR}/string.h
    INTERFACE
        FILE_SET config TYPE HEADERS
            BASE_DIRS
                ${CBINDGEN_INCLUDEDIR}
            FILES
                ${CBINDGEN_TARGET_DIR}/config.h
)

install(
    TARGETS ${${PROJECT_NAME}-LIBRARY_NAME}
    EXPORT ${PROJECT_NAME}-config
    FILE_SET api
    FILE_SET config
)

# \note Install the Cargo-built core bindings to enable direct linkage.
install(
    FILES $<TARGET_PROPERTY:${BINDINGS_NAME},IMPORTED_LOCATION>
    DESTINATION ${CMAKE_INSTALL_LIBDIR}
)

install(EXPORT ${PROJECT_NAME}-config
        FILE ${PROJECT_NAME}-config.cmake
        NAMESPACE "${PROJECT_NAME}::"
        DESTINATION ${CMAKE_INSTALL_LIBDIR}/cmake/${LIB}
)

if(BUILD_TESTING)
    add_subdirectory(test EXCLUDE_FROM_ALL)

    enable_testing()
endif()

add_subdirectory(docs)

add_subdirectory(examples EXCLUDE_FROM_ALL)
