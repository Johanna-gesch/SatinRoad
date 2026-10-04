using Infra.Repositories.Interfaces;

namespace Infra.Repositories;

public class Clock : IClock
{
    public DateTime UtcNow => DateTime.UtcNow;
}