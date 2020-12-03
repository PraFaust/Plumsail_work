using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Plumsail_work.Models;

namespace Plumsail_work
{
    public class InitData
    {
        public static void Initialize(UserContext context)
        {
            if (!context.Users.Any())
            {
                context.Users.AddRange(
                    new User
                    {
                        id = 0,
                        firstname = "Maxim",
                        username = "Admin",
                        email = "maximnsuslov@gmail.com",
                        pass = "12345678",
                        sex = "male",
                        newsletter = true
                    }
                );
                context.SaveChanges();
            }
        }
    }
}
