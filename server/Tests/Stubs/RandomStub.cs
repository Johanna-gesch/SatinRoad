using Infra.Repositories.Interfaces;

namespace Tests.Stubs;

public class RandomStub : IRandom
{
    public int Value { get; set; }
    
    public int Next(int minValue, int maxValue)
    {
        return Value;
    }
}