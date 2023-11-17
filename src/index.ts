import express from 'express';
import ListaFilme from './aplicacao/lista-filme.use-case';
import BancoMongoDB from './infra/banco/banco-mongodb';
import SalvaFilme from './aplicacao/salva-filme.use-case';

const app = express();
app.use(express.json());

const bancoMongoDB = new BancoMongoDB();

app.get('/filmes', async (req, res) => {
  try {
    const listaFilme = new ListaFilme(bancoMongoDB);
    const filmes = await listaFilme.executar();
    res.send(filmes);
  } catch (error) {
    res.status(500).send('Erro ao buscar filmes');
  }
});

app.post('/filmes', async (req, res) => {
 
    const { id, titulo, descricao, imagem } = req.body;
    const filme = {
      id,
      titulo,
      descricao,
      imagem
    };
    try {
    const salvaFilme = new SalvaFilme(bancoMongoDB);
    await salvaFilme.execute(filme);
    res.status(201).send(filme);
  } catch (error) {
    res.status(500).send('Erro ao cadastrar o filme');
  }
});

app.get('/filmes/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    
    const filme = buscarFilmePorId(id); 

    if (!filme) {
      return res.status(404).send('Filme não encontrado');
    }
    res.status(200).send(filme);
  } catch (error) {
    res.status(500).send('Erro ao buscar o filme');
  }
});


app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});


type Filme = {
  id: number;
  titulo: string;
  descricao: string;
  imagem: string;
};

let filmesCadastrados: Filme[] = []; 


function buscarFilmePorId(id: number): Filme | undefined {
  return filmesCadastrados.find(filme => filme.id === id);
}
