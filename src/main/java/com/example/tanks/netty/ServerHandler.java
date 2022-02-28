package com.example.tanks.netty;

import com.alibaba.fastjson.JSON;
import io.netty.channel.ChannelHandlerContext;
import io.netty.channel.SimpleChannelInboundHandler;
import io.netty.channel.group.ChannelGroup;
import io.netty.channel.group.DefaultChannelGroup;
import io.netty.handler.codec.http.websocketx.TextWebSocketFrame;
import io.netty.util.concurrent.GlobalEventExecutor;

import java.util.ArrayList;
import java.util.List;

public class ServerHandler extends SimpleChannelInboundHandler<TextWebSocketFrame> {

    private static ChannelGroup group = new DefaultChannelGroup(GlobalEventExecutor.INSTANCE); //用于广播数据
    private static List<String> role = new ArrayList<>(); //用户集合

    @Override
    public void handlerAdded(ChannelHandlerContext ctx) throws Exception {
        group.add(ctx.channel());
    }

    @Override
    public void handlerRemoved(ChannelHandlerContext ctx) throws Exception {
        group.remove(ctx.channel());
    }

    @Override
    protected void messageReceived(ChannelHandlerContext ctx, TextWebSocketFrame twf) throws Exception {
        if (twf.text().contains("create")) {
            role.add(twf.text());
            group.writeAndFlush(new TextWebSocketFrame(JSON.toJSONString(role)));
        } else {
            group.forEach(channel -> {
                if (channel != ctx.channel()) {
                    channel.writeAndFlush(new TextWebSocketFrame(twf.text()));
                }
            });
        }
    }

    @Override
    public void exceptionCaught(ChannelHandlerContext ctx, Throwable cause) throws Exception {
        cause.printStackTrace();
        group.remove(ctx.channel());
        ctx.close();
    }
}