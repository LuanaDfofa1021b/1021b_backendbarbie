import mongoose from "mongoose";
import FilmeRepositorioInterface from "../../aplicacao/filme-repositorio-interface";
require("dotenv").config();
export default class BancoMongoDB implements  FilmeRepositorioInterface {
  public filmeModelo: any;
  constructor() {
    try{
      mongoose.connect(process.env.MONGODB_URL || "")
    }catch(error){
      console.log(error)
    }
    this.filmeModelo = mongoose.model("Filme", 
        new mongoose.Schema({
            _id: Number,
            titulo: String,
            sinopse: String,
            imagem: String
        })
    )
  }
  async salvar(filme: Filme): Promise<Filme> {
    const filmeDTO = {
      _id: filme.id,
      titulo: filme.titulo,
      sinopse: filme.sinopse,
      imagem: filme.imagem
    }
    const filmeModelo = new this.filmeModelo(filmeDTO)
    const result =  await filmeModelo.save()
    const filmeSalvo = {
      id: result._id,
      titulo: result.titulo,
      sinopse: result.sinopse,
      imagem: result.imagem
    }
    return filmeSalvo
  }
  async listar(): Promise<Filme[]> {
    const listaFilme = await this.filmeModelo.find()
    return listaFilme.map((filme:FilmeDTO) => {
      return {
        id: filme._id,
        titulo: filme.titulo,
        sinopse: filme.sinopse,
        imagem: filme.imagem
      }
    })
  }
  async buscarPorId(id:number): Promise<Filme> {
    return new Promise((resolve, reject) => {
      reject(new Error("Not implemented yet"));
    })
  }
}
type Filme = {
  id: number,
  titulo: string,
  sinopse: string,
  imagem: string
};
type FilmeDTO = {
  _id: number,
  titulo: string,
  sinopse: string,
  imagem: string
}