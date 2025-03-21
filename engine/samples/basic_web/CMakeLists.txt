FetchContent_Declare(
    spdlog
    GIT_REPOSITORY "https://github.com/gabime/spdlog"
    GIT_TAG v1.15.1
    GIT_PROGRESS TRUE
)
FetchContent_MakeAvailable(spdlog)


set(SOURCES main.cpp)
set(SAMPLE_NAME basic_web)
add_executable(${SAMPLE_NAME} ${SOURCES})
target_include_directories(
    ${SAMPLE_NAME} 
    PRIVATE 
    ${CMAKE_CURRENT_SOURCE_DIR}/include
    )
target_link_libraries(${SAMPLE_NAME} PRIVATE ${CORE_LIB})
target_include_directories(${SAMPLE_NAME} PRIVATE ${spdlog_SOURCE_DIR}/include)

# Global didn't work, so I had to set it for each target
# target_link_options(${CORE_LIB} PRIVATE -sFILESYSTEM=0 )

set(DISABLE_EXCEPTION_CATCHING 1)

target_link_options(${SAMPLE_NAME} PRIVATE -sFILESYSTEM=0 -sENVIRONMENT="web")
# --closure 1 DISABLE_EXCEPTION_CATCHING=1 -sEVAL_CTORS=2
# Default: -sEXIT_RUNTIME=0
# -sENVIRONMENT="web" only reduced size by a little bit 