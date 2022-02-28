package com.example.tanks.netty;

import io.netty.bootstrap.ServerBootstrap;
import io.netty.channel.*;
import io.netty.channel.nio.NioEventLoopGroup;
import io.netty.channel.socket.SocketChannel;
import io.netty.channel.socket.nio.NioServerSocketChannel;
import io.netty.handler.codec.http.HttpObjectAggregator;
import io.netty.handler.codec.http.HttpServerCodec;
import io.netty.handler.codec.http.websocketx.WebSocketServerProtocolHandler;
import io.netty.handler.stream.ChunkedWriteHandler;

public class GameServer {

    public void run(String host, int port) {
        EventLoopGroup bossGroup = new NioEventLoopGroup(); //主
        EventLoopGroup workerGroup = new NioEventLoopGroup(); //从，数量默认电脑核数的2倍
        try {
            ServerBootstrap b = new ServerBootstrap();
            b.group(bossGroup, workerGroup)
                    .channel(NioServerSocketChannel.class) //服务器通道
                    .option(ChannelOption.SO_BACKLOG, 128) //主，tcp链接数量
                    .childOption(ChannelOption.SO_KEEPALIVE, true)  //从，保持存活
                    .childHandler(new ChannelInitializer<SocketChannel>() { //从，设置通道
                        @Override
                        protected void initChannel(SocketChannel socketChannel) throws Exception {
                            ChannelPipeline pipeline = socketChannel.pipeline();
                            //设置管道
                            pipeline.addLast("http-codec", new HttpServerCodec()); //http协议编解码
                            pipeline.addLast("http-chunked", new ChunkedWriteHandler()); //以数据块形式传输
                            pipeline.addLast("aggregator", new HttpObjectAggregator(65536)); //合并大小
                            pipeline.addLast("websocket", new WebSocketServerProtocolHandler("/")); //websocket通信
                            pipeline.addLast("handler", new ServerHandler()); //自定义handler
                        }
                    });
            ChannelFuture cf = b.bind(host, port).sync();
            cf.channel().closeFuture().sync();
        } catch (InterruptedException e) {
            e.printStackTrace();
        } finally {
            bossGroup.shutdownGracefully();
            workerGroup.shutdownGracefully();
        }
    }

    public static void main(String[] args) {
//        String host = "192.168.1.101"; //局域网
        String host = "127.0.0.1"; //本机

        int port = 8000;
        new GameServer().run(host, port);
    }

}
