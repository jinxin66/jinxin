import pygame
import sys
import random

pygame.init()
#申请一块屏幕,并命名
screen_x = 800
screen_y = 650
screen = pygame.display.set_mode((screen_x,screen_y))
pygame.display.set_caption("进击的坦克！")
#读取资源
tank_1 = pygame.image.load("tank_1.png")
tank_2 = pygame.image.load("tank_3.png")
pygame.mixer.music.load("bgm.mp3")
death = pygame.mixer.Sound("death.wav")
begin = pygame.mixer.Sound("wait.wav")
end = pygame.mixer.Sound("wait.wav")
#背景音乐播放
# pygame.mixer.music.play(-1, 1.0)
#图像处理
img_size = 50
myImg = pygame.transform.scale(tank_1, (img_size, img_size))
otherImg = pygame.transform.scale(tank_2, (img_size, img_size))
line_size = 30

#坦克类
class Tank:
    def __init__(self, x,y,direc,img,firetime):
        self.x=x
        self.y=y
        self.direc=direc
        self.firetime=firetime
        self.img=img
        self.speed=1
        self.islive=True
        self.iscango=True
        self.iscanfire=True
    def moveUp(self):
        self.img = pygame.transform.rotate(self.img, (self.direc-0)*90)
        self.direc=0
        if self.y>line_size and self.iscango:
            self.y -= self.speed
    def moveDown(self):
        self.img = pygame.transform.rotate(self.img, (self.direc-2)*90)
        self.direc=2
        if self.y<(screen_y-img_size) and self.iscango:
            self.y += self.speed
    def moveLeft(self):
        self.img = pygame.transform.rotate(self.img, (self.direc-3)*90)
        self.direc=3
        if self.x>0 and self.iscango:
            self.x -= self.speed
    def moveRight(self):
        self.img = pygame.transform.rotate(self.img, (self.direc-1)*90)
        self.direc=1
        if self.x<(screen_x-img_size) and self.iscango:
            self.x += self.speed
#我方坦克继承坦克类
class MyTank(Tank):
    def __init__(self, x,y,direc,img,firetime): #先继承，再重构
        Tank.__init__(self, x,y,direc,img,firetime) # 继承父类的构造方法
        self.hp = 1
        self.turn = direc
    def fire(self):
        myBullet.append(Bullet(self.x+int(img_size/2),self.y+int(img_size/2),self.direc))
# 敌方坦克继承坦克类
class OtherTank(Tank):
    def __init__(self, x,y,direc,img,firetime):
        Tank.__init__(self, x,y,direc,img,firetime)
        self.turn = random.randint(0, 4)
    def fire(self):
        otherBullet.append(Bullet(self.x+int(img_size/2),self.y+int(img_size/2),self.direc))
# 敌方坦克继承坦克类
class Bullet:
    def __init__(self, x,y,direc):
        self.x=x
        self.y=y
        self.direc=direc
        self.speed=2
        self.islive=True
        self.iscango=True
    def move(self):
        if self.direc == 0:
            if self.y>line_size and self.iscango:
                self.y -= self.speed
            else:
                self.islive=False
        if self.direc == 2:
            if self.y<screen_y and self.iscango:
                self.y += self.speed
            else:
                self.islive=False
        if self.direc == 1:
            if self.x<screen_x and self.iscango:
                self.x += self.speed
            else:
                self.islive=False
        if self.direc == 3:
            if self.x>0 and self.iscango:
                self.x -= self.speed
            else:
                self.islive=False

myfiretime = 50 #我方冷却时间
otherfiretime = 50 #敌方冷却时间
# myTank = MyTank(0, line_size, 0, myImg, myfiretime)
myBullet = []
# otherTank = []
otherBullet = []

def button(msg, x, y, w, h, ic, ac, action=None):
    mouse = pygame.mouse.get_pos()
    click = pygame.mouse.get_pressed()
    if x + w > mouse[0] > x and y + h > mouse[1] > y:
        pygame.draw.rect(screen, ac, (x, y, w, h))
        if click[0] == 1 and action != None:
            action()
    else:
        pygame.draw.rect(screen, ic, (x, y, w, h))
    text = pygame.font.SysFont('comicsansms', 20)
    showTxt = text.render(msg, True, (0,0,0))
    screen.blit(showTxt, ((x + (w / 4)), (y + (h / 4))))

def game_intro():
    global pasue
    pause = False

    begin.play()

    while True:
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                pygame.quit()
                quit()
        screen.fill((255,255,255))

        font = pygame.font.SysFont("comicsansms", 115)  # 通过字体文件获得字体对象
        over = font.render("Welcome", True, (0,0,0))
        screen.blit(over, (175, 250))

        button("GO", 150, 450, 100, 50, (0,200,0), (0,255,0), game_loop)
        button("Quit", 550, 450, 100, 50, (200,0,0), (255,0,0), game_quit)
        pygame.display.update()

def game_loop():
    global pasue
    begin.stop()
    end.stop()
    pygame.mixer.music.play(-1, 1.0)

    timer = 0 # timer用于计时
    level = 1  # level用于记录关卡数
    gread = 0 # gread 用于记录积分

    # 创建我方坦克
    myTank = MyTank(0, line_size, 0, myImg, myfiretime)
    # 创建敌方坦克
    otherTank = []
    for i in range(level * 3):
        x = random.randint(img_size, screen_x - img_size)
        y = random.randint(img_size + line_size, screen_y - line_size - img_size)
        otherTank.append(OtherTank(x, y, 0, otherImg, otherfiretime))

    while True:
        # 事件触发判断
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                game_quit()
            if event.type == pygame.KEYDOWN:
                if event.key == pygame.K_p:
                    pause = True
                    paused()
            if event.type == pygame.KEYUP:
                if event.key == pygame.K_SPACE:
                    myTank.fire()

        # timer自增用于计时
        timer += 1
        if timer == 2000:
            timer = 0

        # 获取用户键值让我方坦克移动
        key = pygame.key.get_pressed()
        if myTank.islive:
            if key[pygame.K_w] or key[pygame.K_UP]:
                myTank.moveUp()
            elif key[pygame.K_s] or key[pygame.K_DOWN]:
                myTank.moveDown()
            elif key[pygame.K_d] or key[pygame.K_RIGHT]:
                myTank.moveRight()
            elif key[pygame.K_a] or key[pygame.K_LEFT]:
                myTank.moveLeft()
            elif key[pygame.K_SPACE]:
                if timer % myTank.firetime == 0:
                    myTank.fire()
            screen.blit(myTank.img, (myTank.x, myTank.y))
        else:
            pygame.mixer.music.pause()  # 暂停背景音乐
            death.play()  # 死亡音效
            pygame.time.delay(1500)
            death.stop()
            game_over()

        # 让我方子弹自动
        for e in myBullet:
            if e.islive:
                e.move()
                pygame.draw.circle(screen, (255, 255, 255), (e.x, e.y), 3)
            else:
                myBullet.remove(e)

        # 让敌方坦克自动
        for e in otherTank:
            if e.islive:
                if timer % 200 == random.randint(100, 200):
                    e.turn = random.randint(0, 4)
                if e.turn == 0:
                    e.moveUp()
                elif e.turn == 2:
                    e.moveDown()
                elif e.turn == 1:
                    e.moveRight()
                elif e.turn == 3:
                    e.moveLeft()
                screen.blit(e.img, (e.x, e.y))
                if timer % e.firetime == 0:
                    e.fire()
            else:
                otherTank.remove(e)
            if len(otherTank) == 0:
                level += 1
                myTank.hp += 1
                gread += 100

                font3 = pygame.font.SysFont("comicsansms", 96)  # 通过字体文件获得字体对象
                over3 = font3.render("level : "+ str(level), True, (255, 255, 255))
                screen.blit(over3, (150, 250))
                pygame.display.update()
                pygame.time.delay(1500)

                for i in range(level * 3):
                    x = random.randint(img_size, screen_x - img_size)
                    y = random.randint(img_size + line_size, screen_y - line_size - img_size)
                    otherTank.append(OtherTank(x, y, 0, otherImg, otherfiretime))
                if level == 6:
                    game_over()

        # 让敌方子弹自动
        for e in otherBullet:
            if e.islive:
                e.move()
                pygame.draw.circle(screen, (0, 0, 255), (e.x, e.y), 3)
            else:
                otherBullet.remove(e)

        for m in myBullet:
            if m.islive:
                for o in otherTank:
                    if o.islive:
                        if m.x > o.x and m.x < (o.x + img_size) and m.y > o.y and (m.y < o.y + img_size)         :
                            o.islive = False
                            m.islive = False
                            gread += 1

        for o in otherBullet:
            if o.islive:
                if myTank.islive:
                    if o.x > myTank.x and o.x < myTank.x + img_size and o.y > myTank.y and o.y < myTank.y + img_size:
                        myTank.hp -= 1
                        if myTank.hp == 0:
                            myTank.islive = False
                        o.islive = False

        #书写积分关卡hp
        font = pygame.font.SysFont("comicsansms", 24)  # 通过字体文件获得字体对象
        greads = font.render("gread : "+str(gread), True, (255,255,255), (0,0,0))
        screen.blit(greads, (0, 0))
        levels = font.render("level : "+str(level), True, (255,255,255), (0,0,0))
        screen.blit(levels, (screen_x/4, 0))
        hps = font.render("hp : "+ str(myTank.hp), True, (255,255,255), (0,0,0))
        screen.blit(hps, (screen_x/2, 0))

        # 延时刷新
        pygame.display.update()
        pygame.time.delay(5)
        screen.fill((0, 0, 0))

def paused():
    global pasue
    pause = True
    pygame.mixer.music.pause()  # 暂停背景音乐
    while True:
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                game_quit()
        screen.fill((255,255,255))

        font = pygame.font.SysFont("comicsansms", 115)  # 通过字体文件获得字体对象
        over = font.render("Paused", True, (0,0,0))
        screen.blit(over, (175, 250))

        button("Continue", 150, 450, 100, 50, (0,200,0), (0,255,0), unpause)
        button("Quit", 550, 450, 100, 50, (200,0,0), (255,0,0), game_quit)
        pygame.display.update()

def unpause():
    global pause
    pause = False
    game_loop()

def game_over():
    pygame.mixer.music.stop()  # 停址背景音乐
    end.play()
    while True:
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                game_quit()
        screen.fill((255,255,255))

        font = pygame.font.SysFont("comicsansms", 115)  # 通过字体文件获得字体对象
        over = font.render("Game over", True, (0,0,0))
        screen.blit(over, (175, 250))

        button("Again", 150, 450, 100, 50, (0,200,0), (0,255,0), game_loop)
        button("Quit", 550, 450, 100, 50, (200,0,0), (255,0,0), game_quit)
        pygame.display.update()

def game_quit():
    pygame.quit()
    sys.exit()

game_intro()
