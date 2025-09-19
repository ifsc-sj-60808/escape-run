import pygame
import sys

pygame.init()
screen = pygame.display.set_mode((640, 480), pygame.FULLSCREEN)
pygame.display.set_caption("Programa Mínimo Pygame")

running = True
while running:
  for event in pygame.event.get():
    if event.type == pygame.QUIT:
      running = False

  screen.fill((0, 0, 0))
  
pygame.quit()
sys.exit()
