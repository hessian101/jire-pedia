from fastapi import FastAPI

#アプリの実体（インスタンス）を作成　appが今後すべての注文を受け取る窓口になる。
app = FastAPI()

"""
デコレータ（@で始まるもの）
もしユーザが「/」というurlアクセスした場合にすぐ下の関数を実行してくださいという命令をappにしている。
".get"はhttp通信のGETメソッド（データをください）に対応する。ブラウザでURLを開く行為は、基本的にすべてGET。
read_rootという関数の定義
messageという辞書を返す。fastapiでは辞書を返すと自動的にJSONというWeb標準のデータ形式に変換してくれるらしい。すごい！！
"""
@app.get("/")
def read_root():
  return {"message": "Hello, Jire-pedia!"}

@app.get("/items/{item_name}")   # {item_name}→urlの一部を変数として扱っている。
def read_item(item_name: str):
  return {"item_name": item_name, "message": "これを受け取りました"}