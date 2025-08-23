import numpy as np
import matplotlib.pyplot as plt
import pandas as pd
import sklearn

from sklearn.neural_network import MLPClassifier

X = [ [0,0], [0,1], [1,0], [1,1] ]
y = [ 0, 1, 1, 0 ]

mlp = MLPClassifier(verbose=True, max_iter=2000, tol=1e-3, activation='relu')

mlp.fit(X, y)

for caso in X:
    print(f'Caso: {caso} - Predição: {mlp.predict([caso])}')

print(f'Classes = {mlp.classes_}')
print(f'Erro = {mlp.loss_}')
print(f'Amostras visitadas = {mlp.t}')
print(f'Atributos de entrada = {mlp.n_features_in_}')
print(f'N ciclos = {mlp.n_iter_}')
print(f'N camadas = {mlp.n_layers_}')
print(f'Tamanho das camadas ocultas {mlp.hidden_layer_sizes}')

