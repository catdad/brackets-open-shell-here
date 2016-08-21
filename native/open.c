#include <stdlib.h>
#include <stdio.h>
#include <string.h>

// yup, this is a short and silly program
int main(int argc, char *argv[])
{
    char command[1024] = "";
    
    printf("argc is %d\n", argc);
    
    strcat(command, "start ");
    
    if (argc > 1) {
        printf("title is %s\n", argv[1]);
        
        strcat(command, "\"");
        strcat(command, argv[1]);
        strcat(command, "\" ");
    }
    else {
        strcat(command, "\"cmd\" ");
    }
    
    strcat(command, "cmd.exe");
    
    system(command);
    return 0;
}
