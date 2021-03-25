using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Desafio.Thomson.ViewModels
{
    public class DomainViewModel
    {
        public string Servidor { get; set; }
        public string IP_Registro { get; set; }
        public string Dados_Dominio { get; set; }
        public string Hospedado { get; set; }
        public int TTL { get; set; }
    }
}
