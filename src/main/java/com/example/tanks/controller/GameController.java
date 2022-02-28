package com.example.tanks.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpSession;

@Controller
public class GameController {

    @GetMapping("game")
    public ModelAndView game(@RequestParam("color") String color, HttpSession session) {
        ModelAndView mv = new ModelAndView();
        mv.addObject("color", color);
        mv.setViewName("game");
        return mv;
    }

}
