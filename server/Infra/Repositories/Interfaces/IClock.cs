namespace Infra.Repositories.Interfaces;

public interface IClock
{
    DateTime UtcNow { get; }
}