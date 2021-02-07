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
            var admin = context.Users
                    .Where(b => b.username == "Admin")
                    .FirstOrDefault();

            if (admin == null)
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

            Console.WriteLine("admin id is " + admin.id);
        }
    }
}
