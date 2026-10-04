using Infra.Repositories.Interfaces;

namespace Infra.Repositories;

public class RandomGenerator : IRandom
{
    private readonly Random random = new();
    
    public int Next(int minValue, int maxValue)
    {
        return random.Next(minValue, maxValue);
    }
}