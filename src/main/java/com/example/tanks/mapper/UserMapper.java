package com.example.tanks.mapper;

import org.apache.ibatis.annotations.Mapper;

import java.util.Map;

@Mapper
public interface UserMapper {

    Map<String, Object> auth(String username, String password);

    int create(String username, String password);

}
