<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class IndexController extends Controller
{
    //
    public function index(Request $request){

        return Inertia::render('Index',[
            'user'=>['name'=>'Daniel']
        ]);

    }
}
