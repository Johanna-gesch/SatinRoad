namespace Infra.Repositories.Interfaces;

public interface IRandom
{
    int Next(int minValue, int maxValue);
}