using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Desafio.Bitium.Models;
using Whois.NET;
using Microsoft.EntityFrameworkCore;
using DnsClient;
using Desafio.Thomson.ViewModels;

namespace Desafio.Bitium.Controllers
{
    [Route("api")]
    public class DomainController : Controller
    {
        private readonly DatabaseContext _db;

        public DomainController(DatabaseContext db)
        {
            _db = db;
        }

        [HttpGet, Route("domain/{domainName}")]
        public async Task<IActionResult> Get(string domainName)
        {
            var domain = await _db.Domains.FirstOrDefaultAsync(d => d.Name == domainName);

            if (domain == null)
            {
                var response = await WhoisClient.QueryAsync(domainName);

                var lookup = new LookupClient();
                var result = await lookup.QueryAsync(domainName, QueryType.ANY);
                var record = result.Answers.ARecords().FirstOrDefault();
                var address = record?.Address;
                var ip = address?.ToString();

                var hostResponse = await WhoisClient.QueryAsync(ip);

                domain = new Domain
                {
                    Name = domainName,
                    Ip = ip,
                    UpdatedAt = DateTime.Now,
                    WhoIs = response.Raw,
                    Ttl = record?.TimeToLive ?? 0,
                    HostedAt = hostResponse.OrganizationName
                };

                _db.Domains.Add(domain);
            }

            if (DateTime.Now.Subtract(domain.UpdatedAt).TotalMinutes > domain.Ttl)
            {
                var response = await WhoisClient.QueryAsync(domainName);

                var lookup = new LookupClient();
                var result = await lookup.QueryAsync(domainName, QueryType.ANY);
                var record = result.Answers.ARecords().FirstOrDefault();
                var address = record?.Address;
                var ip = address?.ToString();

                var hostResponse = await WhoisClient.QueryAsync(ip);

                domain.Name = domainName;
                domain.Ip = ip;
                domain.UpdatedAt = DateTime.Now;
                domain.WhoIs = response.Raw;
                domain.Ttl = record?.TimeToLive ?? 0;
                domain.HostedAt = hostResponse.OrganizationName;
            }

            await _db.SaveChangesAsync();

            var viewModelDomain = new DomainViewModel
            {
                Servidor = domain.Name,
                IP_Registro = domain.Ip,
                Dados_Dominio = domain.WhoIs,
                TTL = domain.Ttl,
                Hospedado = domain.HostedAt
            };

            return Ok(viewModelDomain);
        }
    }
}
