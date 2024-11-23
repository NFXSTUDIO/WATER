# -*- coding: utf-8 -*-
"""
Created on Fri Nov 22 17:36:52 2024

@author: arthu
"""

import json
import os
from tkinter import Tk, Label,Canvas
from PIL import Image, ImageTk
import time

# Chemin vers le fichier
fichier = "Penguins/animationData.json"
animation = "idleSpin"
folder = "Penguins/TenderBud"
anim_name = "idle"
animation_after_id = None
animation_played = False
x_offset = 0
y_offset = 0

def open_json_files(files):
    # Ouverture et lecture du fichier
    with open(files, 'r') as f:
        data = json.load(f)
    
    # Affichage de quelques informations (à adapter selon votre structure JSON)
    return data['TenderBud']

def extract_animation_data(files,animations):
    data = open_json_files(files)
    return data[animations]

def extract_coordinate(files,animations):
    anim_data = extract_animation_data(files, animations)
    w,h,x,y = [],[],[],[]
    for i in anim_data:
        w.append(i['w'])
        h.append(i['h'])
        x.append(i['x'])
        y.append(i['y'])
    return w,h,x,y

w,h,x,y = extract_coordinate(fichier, animation)

def extract_images(folder, anim_name):
    directory = folder + "/" + anim_name
    print(directory)
    file_paths = []
    for root, directories, files in os.walk(directory):
        for file in files:
            file_path = os.path.join(root, file)
            file_paths.append(file_path)

    # Sort file paths numerically, considering numeric prefixes in filenames
    def numeric_sort_key(file_path):
        filename = os.path.basename(file_path)
        numeric_part = ''.join(c for c in filename if c.isdigit())
        return int(numeric_part)

    sorted_file_paths = sorted(file_paths, key=numeric_sort_key)

    return sorted_file_paths

def show_image(canvas, img_path, w, h, x, y):
    image = Image.open(img_path)
    image = image.resize((w, h))
    photo = ImageTk.PhotoImage(image)

    # Stocker l'image pour éviter le garbage collector
    canvas.image = photo  

    # Ajouter l'image sur le Canvas
    canvas.delete("all")
    canvas.create_image(x + x_offset, y + y_offset, anchor="nw", image=photo)
    
def stop_animation(event):
    # Appeler stop_current_animation pour arrêter l'animation en cours
    stop_current_animation()

def stop_current_animation():
    global animation_after_id, animation_played
    if animation_after_id:
        # Annuler l'animation actuelle
        canvas.after_cancel(animation_after_id)
        animation_after_id = None
    animation_played = False  # Réinitialiser le flag

# Fonction d'animation
def animation(canvas, img_paths, w, h, x, y, index=0):
    global animation_after_id  # Accéder à l'ID d'animation pour l'annuler

    if not animation_played:
        return  # Stopper l'animation si le flag est False
    
    # Afficher l'image actuelle
    show_image(canvas, img_paths[index], w[index], h[index], x[index], y[index])
    
    # Passer à l'image suivante
    next_index = (index + 1) % len(img_paths)
    
    # Programmer la prochaine image (animation)
    animation_after_id = canvas.after(int(1000/15), animation, canvas, img_paths, w, h, x, y, next_index)

# Fonction pour jouer l'animation
def play_anim(canvas, folder, anim_name, files):
    global animation_played
    # Si une animation est déjà en cours, ne rien faire
    if animation_played:
        return
    
    # Arrêter l'animation en cours avant de commencer une nouvelle
    stop_current_animation()

    img = extract_images(folder, anim_name)
    print(img)
    w, h, x, y = extract_coordinate(files, anim_name)

    # Démarrer la nouvelle animation seulement si aucune animation n'est en cours
    animation_played = True
    animation(canvas, img, w, h, x, y)

# Fonctions de déplacement
def move_up(event):
    global y_offset
    if y[0] + y_offset > 0:
        y_offset -= 10
    play_anim(canvas, folder, "walk_N", fichier)

def move_down(event):
    global y_offset
    if y[0] + y_offset < 800 - h[0]:
        y_offset += 10
    play_anim(canvas, folder, "walk_S", fichier)

def move_left(event):
    global x_offset
    if x[0] + x_offset > 0:
        x_offset -= 10
    play_anim(canvas, folder, "walk_W", fichier)

def move_right(event):
    global x_offset
    if x[0] + x_offset < 800 - w[0]/1.5:
        x_offset += 10
    play_anim(canvas, folder, "walk_E", fichier)

def idle(event):
    # Only call play_anim if the animation is not currently playing
    if not animation_played:
        play_anim(canvas, folder, "idleSpin", fichier)
        
# Fonction pour déplacer le sprite à la position du clic de la souris
def move_to_mouse(event):
    global x_offset, y_offset
    # Obtenez la position de la souris (event.x et event.y)
    mouse_x = event.x
    mouse_y = event.y
    
    # Calculez le décalage nécessaire
    x_offset = mouse_x - x[0]
    y_offset = mouse_y - y[0]
    
    # Jouez l'animation du sprite en fonction de sa position
    play_anim(canvas, folder, "idleSpin", fichier)

    
root = Tk()
root.title("Affichage d'une image avec Tkinter")
root.bind("<KeyPress-z>", move_up)
root.bind("<KeyPress-s>", move_down)
root.bind("<KeyPress-q>", move_left)
root.bind("<KeyPress-d>", move_right)
root.bind("<KeyPress-e>",idle)
root.bind("<KeyRelease-z>",stop_animation)
root.bind("<KeyRelease-q>",stop_animation)
root.bind("<KeyRelease-s>",stop_animation)
root.bind("<KeyRelease-d>",stop_animation)
root.bind("<KeyRelease-e>",stop_animation)
root.bind("<Button-1>", move_to_mouse)
# Créer un Canvas
canvas = Canvas(root, width=800, height=800, bg="white")
canvas.pack()
play_anim(canvas, folder, "idleSpin", fichier)

root.mainloop()
