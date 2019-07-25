import pygame
import random

pygame.init()

white = (255, 255, 255)
black = (0, 0, 0)
red = (200, 0, 0)
green = (0, 200, 0)
bright_red = (255, 0, 0)
bright_green = (0, 255, 0)

car_width = 60

display_width = 800
display_height = 600

gameDisplay = pygame.display.set_mode((display_width, display_height))
pygame.display.set_caption('A bit Racey')
clock = pygame.time.Clock()

carImg = pygame.image.load('car.png')
star1 = pygame.image.load('p1.png')
carImg = pygame.transform.scale(carImg,(100,60))
star1 = pygame.transform.scale(star1,(60,45))
pause = False

def things_score(count):
    font = pygame.font.SysFont(None, 25)
    text = font.render("Score:" + str(count), True, green)
    gameDisplay.blit(text, (0, 0))
    #分数

def things(thingx, thingy):
   # pygame.draw.rect(gameDisplay, color, [thingx, thingy, thingw, thingh])
    gameDisplay.blit(star1,(thingx,thingy))
    #掉落物

def car(x, y):
    gameDisplay.blit(carImg, (x, y))
    #躲避物

def text_objects(text, font):
    textSurface = font.render(text, True, black)
    return textSurface, textSurface.get_rect()
    #字体

def crash():
    largeText = pygame.font.SysFont('comicsansms', 115)
    TextSurf, TextRect = text_objects('You Are Dead!', largeText)
    TextRect.center = ((display_width / 2), (display_height / 2))
    gameDisplay.blit(TextSurf, TextRect)
    #结束字体位置及大小
    while True:
        for event in pygame.event.get():
            #print(event)
            if event.type == pygame.QUIT:
                pygame.quit()
                quit()
        ##  gameDisplay.fill(white)
        button("Play Again", 150, 450, 100, 50, green, bright_green, game_loop)
        button("Quit", 550, 450, 100, 50, red, bright_red, quitgame)
        pygame.display.update()
        clock.tick(15)


def button(msg, x, y, w, h, ic, ac, action=None):
    mouse = pygame.mouse.get_pos()
    click = pygame.mouse.get_pressed()
    #print(click)
    if x + w > mouse[0] > x and y + h > mouse[1] > y:
        pygame.draw.rect(gameDisplay, ac, (x, y, w, h))
        if click[0] == 1 and action != None:
            action()
    else:
        pygame.draw.rect(gameDisplay, ic, (x, y, w, h))

    smallText = pygame.font.SysFont('comicsansms', 20)
    textSurf, textRect = text_objects(msg, smallText)
    textRect.center = ((x + (w / 2)), (y + (h / 2)))
    gameDisplay.blit(textSurf, textRect)

def quitgame():
    pygame.quit()
    quit()

def unpause():
    global pause
    pause = False

def paused():
    largeText = pygame.font.SysFont('comicsansms', 115)
    TextSurf, TextRect = text_objects('Paused', largeText)
    TextRect.center = ((display_width / 2), (display_height / 2))
    gameDisplay.blit(TextSurf, TextRect)

    while pause:
        for event in pygame.event.get():
            #print(event)
            if event.type == pygame.QUIT:
                pygame.quit()
                quit()
        ##  gameDisplay.fill(white)
        button("Continue", 150, 450, 100, 50, green, bright_green, unpause)
        button("Quit", 550, 450, 100, 50, red, bright_red, quitgame)
        pygame.display.update()
        clock.tick(15)

def game_intro():
    global pasue
    pause = False
    intro = True
    while intro:
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                pygame.quit()
                quit()
        gameDisplay.fill(white)
        largeText = pygame.font.SysFont('comicsansms', 115)
        TextSurf, TextRect = text_objects('A bit Racey', largeText)
        TextRect.center = ((display_width / 2), (display_height / 2))
        gameDisplay.blit(TextSurf, TextRect)
        button("GO", 150, 450, 100, 50, green, bright_green, game_loop)
        button("Quit", 550, 450, 100, 50, red, bright_red, quitgame)
        pygame.display.update()
        clock.tick(15)

def game_loop():
    global pause
    #躲避物初始位置
    x = display_width * 0.45
    y = display_height * 0.90
    x_change = 0
    score = 0
    gameExit = False

    thing_startx = random.randrange(0, display_width-32) #掉落物的x坐标
    thing_starty = -600
    thing_speed = 7
    thing_width = 45
    thing_height = 45

#触发事件
    while not gameExit:
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                pygame.quit()
                quit()
            if event.type == pygame.KEYDOWN:
                if event.key == pygame.K_LEFT:
                    x_change = -5
                elif event.key == pygame.K_RIGHT:
                    x_change = 5
                elif event.key == pygame.K_p:
                    pause = True
                    paused()
            if event.type == pygame.KEYUP:
                if event.key == pygame.K_LEFT or event.key == pygame.K_RIGHT:
                    x_change = 0
            #print(event)
        x += x_change
        gameDisplay.fill(white)

        things(thing_startx, thing_starty)
        thing_starty += thing_speed

        car(x, y)
        things_score(score)
        # if x > display_width - car_width or x < 0:
        #     gameExit = True
        if x > display_width - car_width:
            x=display_width - car_width
        if x <0:
            x=0   
        if thing_starty > display_height:
            thing_starty = 0 - thing_height
            thing_startx = random.randrange(0, display_width)
            score += 1
            thing_speed += 1
            if thing_speed >= 11:
                thing_speed = 11
        if y < thing_starty + thing_height:
                #print('y crossover')
            if x > thing_startx and x < thing_startx + thing_width or x + car_width > thing_startx and x + car_width < thing_startx + thing_width:
                #print('x crossover')
                crash()    
        
        pygame.display.update()
        clock.tick(60)

game_intro()
game_loop()
pygame.quit()
quit()