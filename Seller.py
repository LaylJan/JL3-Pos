import tkinter as tk
from tkinter import ttk

def test():
    print("test")

def seller():
# Create the main window
    root = tk.Tk()
    root.attributes("-fullscreen", True)
    root.title("Window with Header")
    
    header_canvas = tk.Canvas(root, bg="#00AA00", height=80, highlightthickness=0)
    header_canvas.pack(fill="x")

    frm = ttk.Frame(root, padding=10)
    frm.pack(fill="both", expand=True)

    ttk.Label(frm, text="Hello World!").grid(column=0, row=0)
    ttk.Button(frm, text="Quit", command=test).grid(column=1, row=0)

    # Start the Tkinter event loop
    root.mainloop()
