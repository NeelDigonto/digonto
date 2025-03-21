cmake_minimum_required(VERSION 3.30)

project(Digonto
    DESCRIPTION "Monorepo for my dream company Bostro & some experimental projects"
    LANGUAGES C CXX
)

set(CMAKE_C_STANDARD 23)
set(CMAKE_CXX_STANDARD 26)

set(CMAKE_VERBOSE_MAKEFILE ON)
set(CMAKE_EXPORT_COMPILE_COMMANDS ON)
set(BUILD_SHARED_LIBS OFF CACHE INTERNAL "")
set(BUILD_STATIC_LIBS ON CACHE INTERNAL "")
# set(EMSCRIPTEN_COMPILER_FLAGS "${EMSCRIPTEN_COMPILE_FLAGS} -sSTANDALONE_WASM -sSIDE_MODULE -v")
# set(EMSCRIPTEN_LINK_FLAGS "${EMSCRIPTEN_LINK_FLAGS} v ")
#set(CMAKE_EXECUTABLE_SUFFIX ".wasm")


find_program(CCACHE_PROGRAM ccache)
if(CCACHE_PROGRAM)
    MESSAGE("CCACHE support enabled")
    set_property(GLOBAL PROPERTY RULE_LAUNCH_COMPILE "${CCACHE_PROGRAM}")
    set_property(GLOBAL PROPERTY RULE_LAUNCH_LINK "${CCACHE_PROGRAM}")
endif()

# FetchContent Start
include(FetchContent)
set(FETCHCONTENT_QUIET FALSE)
get_filename_component(fc_cache "../.fetchcontent_cache"
                       REALPATH BASE_DIR "${CMAKE_BINARY_DIR}")
set(FETCHCONTENT_BASE_DIR ${fc_cache})
# FetchContent End

if(MSVC)
  cmake_policy(SET CMP0091 NEW)
  set(CMAKE_WINDOWS_EXPORT_ALL_SYMBOLS TRUE)
endif()

if(CMAKE_BUILD_TYPE AND CMAKE_BUILD_TYPE STREQUAL "Debug")
    add_compile_definitions(_DEBUG)
else()
    add_compile_definitions(NDEBUG)
endif()

set(CORE_LIB "core")

add_subdirectory(libs/core)

add_subdirectory(samples/basic_win)
add_subdirectory(samples/basic_web)