package com.example.tanks.service;

import com.example.tanks.mapper.UserMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


import javax.servlet.http.HttpSession;
import java.util.Map;

@Service
public class UserService {

    @Autowired(required = false)
    UserMapper userMapper;

    public Boolean auth(String username, String password, HttpSession session) {
        Map<String, Object> map = userMapper.auth(username, password);
        if (map != null) {
            session.setAttribute("id", map.get("id"));
            session.setAttribute("username", map.get("username"));
            return true;
        }
        return false;
    }

    public Boolean create(String username, String password) {
        return userMapper.create(username, password) == 1;
    }

}
