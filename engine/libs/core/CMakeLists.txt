set(CORE_LIB_SOURCES 
    ${CMAKE_CURRENT_SOURCE_DIR}/src/core.cpp
)

add_library(${CORE_LIB} STATIC ${CORE_LIB_SOURCES})

target_include_directories(
    ${CORE_LIB} PUBLIC 
    ${CMAKE_CURRENT_SOURCE_DIR}/include
)

target_include_directories(
    ${CORE_LIB} PRIVATE 
    ${CMAKE_CURRENT_SOURCE_DIR}/src
)

