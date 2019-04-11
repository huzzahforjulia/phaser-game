/*
TODO:
 - Dynamic screen scaling
 - figure out what filezilla is and how to use it
 - Buttons for mobile
 - Camera panning
 - See if you can have a website tab icon
 - Build content!
 */

import Phaser from "phaser";
import sky from "./assets/sky.png";
import ground from "./assets/platform.png";
import idle_right from "./assets/idle_right.png";
import idle_left from "./assets/idle_left.png";
import walk from "./assets/walk.png";
import squat_right from "./assets/squat_right.png";
import squat_left from "./assets/squat_left.png";
import fall_right from "./assets/fall_right.png";
import fall_left from "./assets/fall_left.png";
import title from "./assets/title.png";

var config = {
  type: Phaser.AUTO,
  parent: 'phaser-app',
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: {y: 500},
      debug: false
    }
  },
  scene: {
    preload: preload,
    create: create,
    update: update
  }
};

var facingLeft = false;
var player;
var platforms;
var cursors;
var xVelocity = 200;
var yVelocity = 400;

var game = new Phaser.Game(config);

function preload() {
  this.load.image('sky', sky);
  this.load.image('ground', ground);
  this.load.image('title', title);
  this.load.spritesheet('idle_right', idle_right, {frameWidth: 68, frameHeight: 100});
  this.load.spritesheet('idle_left', idle_left, {frameWidth: 68, frameHeight: 100});
  this.load.spritesheet('walk', walk, {frameWidth: 68, frameHeight: 100});
  this.load.spritesheet('squat_left', squat_left, {frameWidth: 68, frameHeight: 100});
  this.load.spritesheet('squat_right', squat_right, {frameWidth: 68, frameHeight: 100});
  this.load.spritesheet('fall_right', fall_right, {frameWidth: 68, frameHeight: 100});
  this.load.spritesheet('fall_left', fall_left, {frameWidth: 68, frameHeight: 100});
}

function create() {
  cursors = this.input.keyboard.createCursorKeys();

  this.add.image(400, 300, 'sky');
  this.add.image(200, 150, 'title');

  platforms = this.physics.add.staticGroup();
  platforms.create(400, 568, 'ground').setScale(2).refreshBody();

  platforms.create(600, 400, 'ground');
  platforms.create(750, 250, 'ground');

  player = this.physics.add.sprite(100, 450, 'walk');
  player.setCollideWorldBounds(true);

  this.physics.add.collider(player, platforms);

  //ANIMATIONS:
  this.anims.create({
    key: 'left',
    frames: this.anims.generateFrameNumbers('walk', {start: 0, end: 3}),
    frameRate: 10,
    repeat:-1
  });

  this.anims.create({
    key: 'idle_right',
    frames: this.anims.generateFrameNumbers('idle_right', {start: 0, end: 1}),
    frameRate: 3,
    repeat: -1
  });

  this.anims.create({
    key: 'idle_left',
    frames: this.anims.generateFrameNumbers('idle_left', {start: 0, end: 1}),
    frameRate: 3,
    repeat: -1
  });

  this.anims.create({
    key: 'right',
    frames: this.anims.generateFrameNumbers('walk', {start: 4, end: 7}),
    frameRate: 10,
    repeat: -1
  });

  this.anims.create({
    key: 'up_left',
    frames: [{key: 'walk', frame: 2}],
    frameRate: 20
  });

  this.anims.create({
    key: 'up_right',
    frames: [{key: 'walk', frame: 5}],
    frameRate: 20
  });

  this.anims.create({
    key: 'squat_left',
    frames: this.anims.generateFrameNumbers('squat_left', {start: 0, end: 0}),
    frameRate: 10,
    repeat:-1
  });

  this.anims.create({
    key: 'squat_right',
    frames: this.anims.generateFrameNumbers('squat_right', {start: 0, end: 0}),
    frameRate: 10,
    repeat:-1
  });

  this.anims.create({
    key: 'fall_right',
    frames: this.anims.generateFrameNumbers('fall_right', {start: 0, end: 1}),
    frameRate: 5,
    repeat: -1
  });

  this.anims.create({
    key: 'fall_left',
    frames: this.anims.generateFrameNumbers('fall_left', {start: 0, end: 1}),
    frameRate: 5,
    repeat: -1
  });

}

function update() {
  //LEFT
  if(cursors.left.isDown){
    facingLeft = true;
    player.setVelocityX(-xVelocity);
    if(!player.body.touching.down)
      player.anims.play('up_left', true);
    else
      player.anims.play('left', true);
  }
  //RIGHT
  else if(cursors.right.isDown){
    facingLeft = false;
    player.setVelocityX(xVelocity);
    if(!player.body.touching.down)
      player.anims.play('up_right', true);
    else
      player.anims.play('right', true);
  }
  //IDLE
  else{
    player.setVelocityX(0);
    if(!player.body.touching.down){
      if(Boolean(facingLeft))
        player.anims.play('fall_left', true);
      else
        player.anims.play('fall_right', true);
    }
    else
    if(Boolean(facingLeft))
      player.anims.play('idle_left', true);
    else
      player.anims.play('idle_right', true);
  }

  if(cursors.up.isDown && player.body.touching.down){
    player.setVelocityY(-yVelocity);
  }

  if(cursors.down.isDown)
  {
    player.setVelocityY(yVelocity);
    if(Boolean(facingLeft))
      player.anims.play('squat_left', true);
    else
      player.anims.play('squat_right', true);
  }
}