from flask import Blueprint, request, jsonify
from flask_cors import cross_origin
from src.sistema_crud import SistemaCRUD

pessoa_bp = Blueprint('pessoa', __name__)
sistema = SistemaCRUD()

@pessoa_bp.route('/pessoas', methods=['GET'])
@cross_origin()
def listar_pessoas():
    """Lista todas as pessoas"""
    try:
        pessoas_dict = [pessoa.to_dict() for pessoa in sistema.pessoas]
        return jsonify({
            'success': True,
            'data': pessoas_dict,
            'message': 'Pessoas listadas com sucesso'
        }), 200
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Erro ao listar pessoas: {str(e)}'
        }), 500

@pessoa_bp.route('/pessoas', methods=['POST'])
@cross_origin()
def criar_pessoa():
    """Cria uma nova pessoa"""
    try:
        data = request.get_json()
        
        if not data or 'nome' not in data or 'idade' not in data:
            return jsonify({
                'success': False,
                'message': 'Nome e idade são obrigatórios'
            }), 400
        
        nome = data['nome'].strip()
        idade = int(data['idade'])
        
        if not nome:
            return jsonify({
                'success': False,
                'message': 'Nome não pode estar vazio'
            }), 400
        
        if idade < 0:
            return jsonify({
                'success': False,
                'message': 'Idade deve ser um número positivo'
            }), 400
        
        # Salva o ID antes de criar para retornar
        novo_id = sistema.proximo_id
        sistema.criar_pessoa(nome, idade)
        
        return jsonify({
            'success': True,
            'data': {'id': novo_id, 'nome': nome, 'idade': idade},
            'message': 'Pessoa criada com sucesso'
        }), 201
        
    except ValueError:
        return jsonify({
            'success': False,
            'message': 'Idade deve ser um número válido'
        }), 400
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Erro ao criar pessoa: {str(e)}'
        }), 500

@pessoa_bp.route('/pessoas/<int:pessoa_id>', methods=['PUT'])
@cross_origin()
def atualizar_pessoa(pessoa_id):
    """Atualiza uma pessoa existente"""
    try:
        data = request.get_json()
        
        if not data or 'nome' not in data or 'idade' not in data:
            return jsonify({
                'success': False,
                'message': 'Nome e idade são obrigatórios'
            }), 400
        
        nome = data['nome'].strip()
        idade = int(data['idade'])
        
        if not nome:
            return jsonify({
                'success': False,
                'message': 'Nome não pode estar vazio'
            }), 400
        
        if idade < 0:
            return jsonify({
                'success': False,
                'message': 'Idade deve ser um número positivo'
            }), 400
        
        # Verifica se a pessoa existe
        pessoa_encontrada = None
        for pessoa in sistema.pessoas:
            if pessoa.id == pessoa_id:
                pessoa_encontrada = pessoa
                break
        
        if not pessoa_encontrada:
            return jsonify({
                'success': False,
                'message': 'Pessoa não encontrada'
            }), 404
        
        sistema.atualizar_pessoa(pessoa_id, nome, idade)
        
        return jsonify({
            'success': True,
            'data': {'id': pessoa_id, 'nome': nome, 'idade': idade},
            'message': 'Pessoa atualizada com sucesso'
        }), 200
        
    except ValueError:
        return jsonify({
            'success': False,
            'message': 'Idade deve ser um número válido'
        }), 400
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Erro ao atualizar pessoa: {str(e)}'
        }), 500

@pessoa_bp.route('/pessoas/<int:pessoa_id>', methods=['DELETE'])
@cross_origin()
def excluir_pessoa(pessoa_id):
    """Exclui uma pessoa"""
    try:
        # Verifica se a pessoa existe
        pessoa_encontrada = None
        for pessoa in sistema.pessoas:
            if pessoa.id == pessoa_id:
                pessoa_encontrada = pessoa
                break
        
        if not pessoa_encontrada:
            return jsonify({
                'success': False,
                'message': 'Pessoa não encontrada'
            }), 404
        
        sistema.excluir_pessoa(pessoa_id)
        
        return jsonify({
            'success': True,
            'message': 'Pessoa excluída com sucesso'
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Erro ao excluir pessoa: {str(e)}'
        }), 500

@pessoa_bp.route('/pessoas/<int:pessoa_id>', methods=['GET'])
@cross_origin()
def obter_pessoa(pessoa_id):
    """Obtém uma pessoa específica pelo ID"""
    try:
        for pessoa in sistema.pessoas:
            if pessoa.id == pessoa_id:
                return jsonify({
                    'success': True,
                    'data': pessoa.to_dict(),
                    'message': 'Pessoa encontrada'
                }), 200
        
        return jsonify({
            'success': False,
            'message': 'Pessoa não encontrada'
        }), 404
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Erro ao buscar pessoa: {str(e)}'
        }), 500

@pessoa_bp.route('/pessoas/exportar', methods=['GET'])
@cross_origin()
def exportar_csv():
    """Exporta dados para CSV"""
    try:
        sistema.exportar_csv()
        return jsonify({
            'success': True,
            'message': 'Dados exportados para pessoas.csv com sucesso'
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Erro ao exportar dados: {str(e)}'
        }), 500

