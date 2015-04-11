Rails.application.routes.draw do
  root 'splash#index'
  get '*path' => redirect('/')
  # root 'sessions#index'
  # resources :users
  # resources :brackets

  # get '/auth/:provider/callback', to: 'sessions#create'
  # get '/game_on', to: 'brackets#game_on', as: :game_on
  # match '/start_game', to: 'brackets#start_game', as: :start_game, via: [:get, :post]
  # post '/save_score', to: 'games#save_score'

end
