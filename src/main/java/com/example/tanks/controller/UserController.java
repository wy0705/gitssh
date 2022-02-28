package com.example.tanks.controller;

import com.example.tanks.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;


import javax.servlet.http.HttpSession;

@Controller
public class UserController {

    @Autowired
    UserService userService;

    @GetMapping("login")
    public String login() {
        return "user/login";
    }

    @PostMapping("login")
    public ModelAndView login(@RequestParam("username") String username,
                              @RequestParam("password") String password,
                              HttpSession session) {
        ModelAndView mv = new ModelAndView();
        if (userService.auth(username, password, session)) {
            mv.setViewName("redirect:person");
        } else {
            mv.addObject("msg", "账号或密码错误");
            mv.setViewName("user/login");
        }
        return mv;
    }

    @GetMapping("register")
    public String register() {
        return "user/register";
    }

    @PostMapping("register")
    public ModelAndView register(@RequestParam("username") String username, @RequestParam("password") String password) {
        ModelAndView mv = new ModelAndView();
        if (userService.create(username, password)) {
            mv.setViewName("redirect:login");
        } else {
            mv.addObject("msg", "注册失败");
            mv.setViewName("user/register");
        }
        return mv;
    }

    @GetMapping("person")
    public ModelAndView person(HttpSession session) {
        ModelAndView mv = new ModelAndView();
        mv.addObject("id", session.getAttribute("id"));
        mv.addObject("username", session.getAttribute("username"));
        mv.setViewName("user/person");
        return mv;
    }

}
