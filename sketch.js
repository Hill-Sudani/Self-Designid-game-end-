var player;
var playerWalking,playerStanding;
var roadImg,mansionImg,livingRoomImg,bodyguardImg;
var bodyguard, bullets, bulletGroup;
var bodyguardGroup;
var BodyGuardHealth = 100; 
var playerHealth = 100;
var gamePosition = "road";
var speakingKey = "a";
var shootStatus = 0;

function preload()
{
  playerWalking = loadAnimation("IMAGES/PLAYER/player1.png","IMAGES/PLAYER/player2.png",
                                "IMAGES/PLAYER/player3.png","IMAGES/PLAYER/player4.png",
                                "IMAGES/PLAYER/player5.png");
  
  playerStanding = loadImage("IMAGES/PLAYER/playerStanding.png");
  roadImg = loadImage("IMAGES/ROAD/road.jpg");
  mansionImg = loadImage("IMAGES/MANSION/mansion.jpg");
  livingRoomImg = loadImage("IMAGES/ROOM IMAGES/living_room.jpg");
  bodyguardImg = loadImage("IMAGES/PLAYER/Bodyguard.png");
}

function setup() 
{
  createCanvas(displayWidth - 400,displayHeight - 400);

  player = createSprite(width - 900,height - 200,50,50);
  player.addImage(playerStanding);

  player.debug = true;
  player.setCollider("rectangle",-15,15,15,80);

  bulletGroup = new Group();
  bodyguardGroup = new Group();

  edges = createEdgeSprites();
}

function draw() 
{
  if(gamePosition === "road")
  {
    background(roadImg); 
  }

  if(player.y >= height - 200 && gamePosition === "road")
  {
    player.y = height - 200;
  }

  if(keyDown("D"))
  {
    player.x += 10;
  }

  if(keyDown("A"))
  {
    player.x -= 10;
  }

  if(keyDown("S") && frameCount % 10 === 0)
  {
    shootBullets(player.x,player.y,15);
  }

  if(keyWentDown(32) && player.y >= height - 200)
  {
    player.velocityY = -15;
  }

  player.velocityY += 1;

  player.collide(edges);

  if(player.x >= width - 50 && gamePosition === "road")
  {
    fill("black")
    textSize(20);
    text("Press M to go to next scene", width/2, height - 200);
  }

  if(player.x >= width - 50 && keyDown("M") && gamePosition === "road")
  {
    //console.log("bg change");
    player.x = width/2 - 500;
    player.y = height - 100;

    pressButton = "m"
    gamePosition = "mansion";
  }

  if(gamePosition === "mansion")
  {
    background(mansionImg);
  }

  if(player.y >= height - 50 && gamePosition === "mansion")
  {
    player.y = height - 50;
  }

  if(gamePosition === "mansion" && speakingKey === "a")
  {
    fill("black")
    textSize(20);
    text("PLAYER : Wow, such a big Mansion. Let's go and check it.",width/2 - 200,height - 50);

    text("Press N key to continue the game",width/2 - 400,height - 350);
  }

  if(speakingKey === "a" && keyDown("N"))
  {
    speakingKey = "b";
  }

  if(speakingKey === "b")
  {
    //console.log("bg change");
    gamePosition = "living room";
    speakingKey = "c";
  }

  if(gamePosition === "living room")
  {
    background(livingRoomImg);
    spawnBodyGuard(width - 200, height - 50);
  }

  if(speakingKey === "c")
  {
    fill("black");
    textSize(20);
    text("Press Q to continue. You can shoot at bodyguard using S key",width/2 - 400,height - 350);
    text("BodyGuard : Hey! Who are You? Get out Of Here!!",width/2 - 200,height - 50);
  }

  if(speakingKey === "c" && keyDown("Q"))
  {
    speakingKey = "d";
    shootStatus = 1;
  }

  if(shootStatus === 1 && frameCount % 50 ===0 && BodyGuardHealth >= 0)
  {
    shootBullets(width - 250, height - 50, -15);
  }

  if(bulletGroup.isTouching(player))
  {
    bulletGroup.destroyEach();
    playerHealth -= 10;
  }

  if(bulletGroup.isTouching(bodyguardGroup))
  {
    bulletGroup.destroyEach();
    BodyGuardHealth -= 10;
  }

  if(BodyGuardHealth <= 0)
  {
    bodyguardGroup.destroyEach();
  }

  textSize(20);
  fill("red");
  text("Your Health = " + playerHealth,width - 900, 50);
  text("Enemy Heath = " + BodyGuardHealth, width - 200, 50);

  if(BodyGuardHealth === 0)
  {
    createSprite(width/2,height/2,width,height);
    text("you win",width/2,height/2);
  }

  drawSprites();
}

function spawnBodyGuard(x,y)
{
  BodyGuard = createSprite(x,y,50,50);
  BodyGuard.addImage(bodyguardImg);
  BodyGuard.scale = 0.5;
  BodyGuard.debug = true;
  BodyGuard.setCollider("rectangle",-5,5,125,175);

  bodyguardGroup.add(BodyGuard);
}

function shootBullets(x,y,velocity)
{
    bullets = createSprite(x,y,10,5);
    bullets.velocityX = velocity;
    bullets.lifetime = 300;
    bullets.shapeColor = "yellow";

    bulletGroup.add(bullets);
}