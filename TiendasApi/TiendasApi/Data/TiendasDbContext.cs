using Microsoft.EntityFrameworkCore;
using TiendasAPI.Models;

public class TiendasDbContext : DbContext
{
    public DbSet<Usuario> Usuarios { get; set; }

    public TiendasDbContext(DbContextOptions<TiendasDbContext> options) : base(options) { }
}