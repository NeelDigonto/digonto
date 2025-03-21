// #include <print>
#include <core/core.hpp>
#include <spdlog/spdlog.h>
#include <emscripten.h>

extern "C" {

EMSCRIPTEN_KEEPALIVE
int init() {

    // std::print("add(1, 2) = {0}", add(1, 2));
    // printf("Hello World!\n");
    spdlog::info("Net Service Initialized.");

    return 0;
}
}
