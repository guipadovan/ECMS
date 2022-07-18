package com.guipadovan.ecms.api.request;


public record PostRequest(String title, String subtitle, String text, boolean locked) {
}
