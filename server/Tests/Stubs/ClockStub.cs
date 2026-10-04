using Infra.Repositories.Interfaces;

namespace Tests.Stubs;

public class ClockStub : IClock
{
    public DateTime UtcNow { get; set; }
}