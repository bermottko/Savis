const { Viagem } = require("../models");
const { Op } = require("sequelize");

const removerViagensCanceladasPassadas = async () => {
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  try {
    const resultado = await Viagem.destroy({
      where: {
        statusID: 2,
        data_viagem: { [Op.lt]: hoje },
      },
    });
  } catch (err) {
    console.error("Erro ao remover viagens canceladas:", err);
  }
};

module.exports = { removerViagensCanceladasPassadas };
