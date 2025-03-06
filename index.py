from flask import Flask, request, jsonify, send_file, render_template
from flask_sqlalchemy import SQLAlchemy
import pandas as pd
import io
import os
import requests
import openpyxl
from openpyxl import Workbook
from openpyxl.utils.dataframe import dataframe_to_rows
from openpyxl.styles import Alignment, Border, Side
from flask_cors import CORS 
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__, static_folder='./static', template_folder='./template')
CORS(app)

app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')

app.config['SQLALCHEMY_DATABASE_URI'] = f"mysql+pymysql://{os.getenv('DB_USER')}:{os.getenv('DB_PASSWORD')}@{os.getenv('DB_HOST')}/{os.getenv('DB_NAME')}"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

print("Conexão efetuada com sucesso na porta http://127.0.0.1:5000")

db = SQLAlchemy(app)

@app.route('/')
def home():
    page = render_template('index.html')
    return page

@app.route('/csv', methods=['POST'])
def gerar_csv():
    try:
        registro = request.get_json()
        data_inicio = registro.get('data-inicio')
        data_fim = registro.get('data-fim')

        if not data_inicio or not data_fim:
            return jsonify({'erro': 'Data Início ou Data Fim não inseridos.'})

        query = f"SELECT ACTION_CARD_ID cardId, MAX(ACTION_DATE) AS CONCLUSION_DATE FROM ACTIONS WHERE ACTION_LIST_AFTER = '670d1616ad6d3d830c285c41' AND ACTION_DATE BETWEEN '"+ data_inicio + "' AND '"+ data_fim + "' GROUP BY  ACTION_CARD_ID"

        print("Data Inicial: " + data_inicio)
        print("Data Final: " + data_fim)

        with db.engine.connect() as conexao:
            df = pd.read_sql(query, conexao)

        data_cards = requests.get(
            'https://api.trello.com/1/boards/62388d998a93181c0fe96d58/cards?key=ab47763a5af3b88111bbda128e1e5498&token=ffd5c4ea8ec16ae8c01258639c3dfe81f9f36adbb397ef2a5923a86a9a0c0a8b&limit=1000'
        )

        data_lists = requests.get(
            'https://api.trello.com/1/boards/62388d998a93181c0fe96d58/lists?key=ab47763a5af3b88111bbda128e1e5498&token=ffd5c4ea8ec16ae8c01258639c3dfe81f9f36adbb397ef2a5923a86a9a0c0a8b'
        )

        board_cards = data_cards.json()
        data_lists = data_lists.json()

        lists = [{'idList': lst['id'], 'listName': lst['name']} for lst in data_lists]
        lists_df = pd.DataFrame(lists)

        lists_filter = ['670d1616ad6d3d830c285c41']

        cards = []
        for card in board_cards:
            if card['labels']:
                for label in card['labels']:
                    cards.append({
                        'cardId': card['id'],
                        'cardName': card['name'],
                        'cardDesc': card['desc'],
                        'idList': card['idList'],
                        'idShort': card['idShort'],
                        'shortUrl': card['shortUrl'],
                        'idLabel': label['id'],
                        'labelName': label['name'],
                        'labelColor': label['color']
                    })
            else:
                cards.append({
                    'cardId': card['id'],
                    'cardName': card['name'],
                    'idList': card['idList'],
                    'idShort': card['idShort'],
                    'shortUrl': card['shortUrl'],
                    'idLabel': '',
                    'labelName': '',
                    'labelColor': ''
                })

        cards_df = pd.DataFrame(cards)
        cards_df = cards_df[cards_df['idList'].isin(lists_filter)]

        merge_df = pd.merge(cards_df, lists_df, on='idList')
        merge_df = pd.merge(merge_df, df, on='cardId')

        done_list_df = merge_df[merge_df['labelColor'] == 'lime']

        
        wb = Workbook()
        ws = wb.active

        
        for r_idx, row in enumerate(dataframe_to_rows(done_list_df, index=False, header=True), 1):
            for c_idx, value in enumerate(row, 1):
                ws.cell(row=r_idx, column=c_idx, value=value)

        
        alignment = Alignment(horizontal='center', vertical='center')
        border = Border(left=Side(border_style='thin'),
                        right=Side(border_style='thin'),
                        top=Side(border_style='thin'),
                        bottom=Side(border_style='thin'))

        for row in ws.iter_rows(min_row=1, max_row=ws.max_row):
            ws.row_dimensions[row[0].row].height = 30
            for cell in row:
                ws.column_dimensions[cell.column_letter].width = 30
                cell.alignment = alignment
                cell.border = border

        
        output = io.BytesIO()
        wb.save(output)
        output.seek(0)

        return send_file(output, as_attachment=True, download_name=f"entregas_da_semana_{data_inicio}_a_{data_fim}.xlsx", mimetype="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")

    except Exception as e:
        return jsonify({'erro': str(e)}), 500

@app.route('/favicon.ico')
def favicon():
    return "", 204

if __name__ == "__main__":
    app.run(debug=True)
