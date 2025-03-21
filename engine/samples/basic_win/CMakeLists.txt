set(SOURCES main.cpp)
set(SAMPLE_NAME basic_win)
add_executable(${SAMPLE_NAME} ${SOURCES})
target_include_directories(
    ${SAMPLE_NAME} 
    PRIVATE 
    ${CMAKE_CURRENT_SOURCE_DIR}/include
    )
target_link_libraries(${SAMPLE_NAME} PRIVATE ${CORE_LIB})