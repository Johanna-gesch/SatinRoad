using LinqToDB;
using LinqToDB.Data;

namespace Infra;

public class MyDataConnection(DataOptions<MyDataConnection> options) : DataConnection(options.Options)
{

}
