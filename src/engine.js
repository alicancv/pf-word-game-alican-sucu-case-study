import * as Matter from "matter-js";

const Engine = Matter.Engine;
const Runner = Matter.Runner;
const Bodies = Matter.Bodies;
const Composite = Matter.Composite;

const engine = Engine.create();

const leftWall = Bodies.rectangle(0, 400, 10, 810, {isStatic:true});
const rightWall = Bodies.rectangle(480, 400, 10, 810, {isStatic:true});

Composite.add(engine.world, [leftWall, rightWall]);

const runner = Runner.create();
Runner.run(runner, engine);

export const addToWorld = (bodyArray) => {
    Composite.add(engine.world, bodyArray);
}

export const removeFromWorld = (bodyArray) => {
    Composite.remove(engine.world, bodyArray);
}