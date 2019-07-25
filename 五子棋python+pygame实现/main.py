import pygame
import math

pygame.init()
screen = pygame.display.set_mode((800,800))
pygame.display.set_caption("五子棋")

background_img = pygame.image.load("qipan.jpg")

matrix = [[0 for i in range(19)] for i in range(19)]
for m in range(19):
    for n in range(19):
        matrix[m][n] = 0;

wb_switch = True

def draw_background(surf):
    surf.blit(background_img,(20,20))

    # 外边框
    frame1_spot = [(30,30),(770,30),(770,770),(30,770)]
    for i in range(3):
        pygame.draw.line(surf, (0,0,0), frame1_spot[i], frame1_spot[i+1], 4)
    pygame.draw.line(surf, (0, 0, 0), frame1_spot[3], frame1_spot[0], 4)

    # 内边框
    frame2_spot = [(40, 40), (760, 40), (760, 760), (40, 760)]
    for i in range(3):
        pygame.draw.line(surf, (0,0,0), frame2_spot[i], frame2_spot[i+1],2)
    pygame.draw.line(surf, (0, 0, 0), frame2_spot[3], frame2_spot[0], 2)

    # 画网格线
    for i in range(19):
        pygame.draw.line(surf, (0, 0, 0), (40 + 40 * i,40), (40 + 40 * i,760),1)
        pygame.draw.line(surf, (0, 0, 0), (40, 40 + 40 * i), (760, 40 + 40 * i), 1)
        if i == 9:
            pygame.draw.line(surf, (0, 0, 0), (40 + 40 * i, 40), (40 + 40 * i, 760), 2)
            pygame.draw.line(surf, (0, 0, 0), (40, 40 + 40 * i), (760, 40 + 40 * i), 2)
            pygame.draw.circle(surf, (0, 0, 0), (40 + 40 * i, 40 + 40 * i), 4)
        if i == 3:
            pygame.draw.circle(surf, (0,0,0), (40 + 40 * i, 40 + 40 * i), 4)
            pygame.draw.circle(surf, (0, 0, 0), (760 - 40 * i, 760 - 40 * i), 4)
            pygame.draw.circle(surf, (0, 0, 0), (40 + 40 * i, 760 - 40 * i), 4)
            pygame.draw.circle(surf, (0, 0, 0), (760 - 40 * i, 40 + 40 * i), 4)
draw_background(screen)

def Play():
    for m in range(19):
        for n in range(19):
            if matrix[m][n] == 2:
                pygame.draw.circle(screen, (255, 255, 255), (40 + 40 * m, 40 + 40 * n), 15)
            if matrix[m][n] == 1:
                pygame.draw.circle(screen, (0, 0, 0), (40 + 40 * m, 40 + 40 * n), 15)
    win()

w_iswin = False
b_iswin = False
isover = False

def win():
    global w_iswin
    global b_iswin
    global isover
    # 横向判断
    for m in range(19):
        for n in range(15):
            if matrix[m][n] == 1:
                if matrix[m][n+1] == 1 and matrix[m][n+2] == 1 and matrix[m][n+3] == 1 and matrix[m][n+4] == 1:
                    w_iswin = True
            if matrix[m][n] == 2:
                if matrix[m][n+1] == 2 and matrix[m][n+2] == 2 and matrix[m][n+3] == 2 and matrix[m][n+4] == 2:
                    b_iswin = True

    # 纵向判断
    for m in range(15):
        for n in range(19):
            if matrix[m][n] == 1:
                if matrix[m+1][n] == 1 and matrix[m+2][n] == 1 and matrix[m+3][n] == 1 and matrix[m+4][n] == 1:
                    w_iswin = True
            if matrix[m][n] == 2:
                if matrix[m+1][n] == 2 and matrix[m+2][n] == 2 and matrix[m+3][n] == 2 and matrix[m+4][n] == 2:
                    b_iswin = True

    # 左斜判断
    for m in range(15):
        for n in range(4,19):
            if matrix[m][n] == 1:
                if matrix[m+1][n-1] == 1 and matrix[m+2][n-2] == 1 and matrix[m+3][n-3] == 1 and matrix[m+4][n-4] == 1:
                    w_iswin = True
            if matrix[m][n] == 2:
                if matrix[m+1][n-1] == 2 and matrix[m+2][n-2] == 2 and matrix[m+3][n-3] == 2 and matrix[m+4][n-4] == 2:
                    b_iswin = True

    # 右斜判断
    for m in range(15):
        for n in range(15):
            if matrix[m][n] == 1:
                if matrix[m + 1][n + 1] == 1 and matrix[m + 2][n + 2] == 1 and matrix[m + 3][n + 3] == 1 and \
                        matrix[m + 4][n + 4] == 1:
                    w_iswin = True
            if matrix[m][n] == 2:
                if matrix[m + 1][n + 1] == 2 and matrix[m + 2][n + 2] == 2 and matrix[m + 3][n + 3] == 2 and \
                        matrix[m + 4][n + 4] == 2:
                    b_iswin = True

    if b_iswin:
        font = pygame.font.SysFont("SimHei", 50)
        chuhe_str = "白棋胜利！"
        chuhe = font.render(chuhe_str, 1, (255, 0, 0))
        screen.blit(chuhe, (300, 340))
        isover = True
    if w_iswin:
        font = pygame.font.SysFont("SimHei", 50)
        chuhe_str = "黑棋胜利！"
        chuhe = font.render(chuhe_str, 1, (255, 0, 0))
        screen.blit(chuhe, (300, 340))
        isover = True

while True:

    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            exit()
        if event.type == pygame.MOUSEBUTTONDOWN:
            m = pygame.mouse.get_pressed()
            if m[0] == 1:
                mx, my = pygame.mouse.get_pos()
                for m in range(19):
                    for n in range(19):
                        if matrix[m][n] == 0:
                            if (math.pow((m*40+40-mx),2) + math.pow((n*40+40-my),2)) <= 400:
                                if wb_switch:
                                    matrix[m][n] = 1
                                    wb_switch = not wb_switch
                                else:
                                    matrix[m][n] = 2
                                    wb_switch = not wb_switch
        if not isover:
            Play()

    pygame.display.update()